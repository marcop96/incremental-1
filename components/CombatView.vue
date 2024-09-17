<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useSkillStore } from '../composable/useSkills'
import monsters from '../data/monsters.json'
import { useInventoryStore } from '~/composable/useInventory'

const skillStore = useSkillStore()
const inventoryStore = useInventoryStore()
const combatStats = skillStore.skills.filter(skill => skill.isCombat)
const sortedMonsters = computed(() => {
  return monsters.sort((a, b) => a.level - b.level)
})
const attack = combatStats.find(stat => stat.name === 'attack')
const defense = combatStats.find(stat => stat.name === 'defense')
const strength = combatStats.find(stat => stat.name === 'strength')
const hitpoints = combatStats.find(stat => stat.name === 'hitpoints')
const isRunningAway = ref(false)
const DEFAULT_WEAPON_SPEED = 0.001
const isRespawning = ref(false)
const rolledDamage = ref(0)
const combatLog = ref<Array<{ action: string, playerDamage?: number, monsterDamage?: number }>>([])
const lootLog = ref<Array<{ name: string, count: number }>>([])
const isCombatActive = ref(false)

const playerWeaponSpeed = ref(DEFAULT_WEAPON_SPEED)
const monsterWeaponSpeed = ref(2)

const player = {
  attack: attack ? attack.level : 0,
  defense: defense ? defense.level : 0,
  strength: strength ? strength.level : 0,
  hitpoints: hitpoints ? hitpoints.level * 10 : 0,
  currentHealth: hitpoints ? hitpoints.level * 10 : 0,
}

const monster = ref({
  id: 1,
  name: 'Goblin',
  health: 1,
  currentHealth: 1,
  attack: 1,
  strength: 1,
  defense: 1,
  speed: 3,
  gold: 5,
  xp: 10,
  drops: [
    { name: 'Bones', chance: 100 },
    { name: 'sword', chance: 10 },
    { name: 'ultra rare', chance: 1 },
    { name: '', chance: 60 },
  ],
})

let playerNextAttackTime: number = 0
let monsterNextAttackTime: number = 0

function startCombat() {
  if (isCombatActive.value) return
  isCombatActive.value = true

  // Initialize next attack times
  const now = Date.now()
  playerNextAttackTime = now + playerWeaponSpeed.value * 1000
  monsterNextAttackTime = now + monsterWeaponSpeed.value * 1000

  combatLoop()
}
function updateMonster(selectedMonsterName: string) {
  const selectedMonster = monsters.find(m => m.name === selectedMonsterName)
  if (selectedMonster) {
    monster.value = {
      ...selectedMonster,
      currentHealth: selectedMonster.health,
    }
    restartCombat()
  }
  selectedMonster?.drops.forEach((drop) => {
    inventoryStore.findItemInDataBase(drop.name)
  })
}
function combatLoop() {
  if (!isCombatActive.value) return
  const now = Date.now()

  if (player.currentHealth > 0 && monster.value.currentHealth > 0) {
    if (now >= playerNextAttackTime) {
      const playerDamage = rollPlayerDamage(player.attack, player.strength, monster.value.defense)
      updateCombatLog('Player', playerDamage, 0)
      playerNextAttackTime = now + playerWeaponSpeed.value * 1000
    }

    if (now >= monsterNextAttackTime) {
      const monsterDamage = rollMonsterDamage(monster.value.attack, monster.value.strength, player.defense)
      updateCombatLog('Monster', 0, monsterDamage)
      monsterNextAttackTime = now + monsterWeaponSpeed.value * 1000
    }

    if (checkIfPlayerIsDead()) {
      // restartCombat()
      updateCombatLog('You Died', null, null)

      return
    }

    if (checkIfMonsterIsDead()) {
      updateCombatLog(`You Killed ${monster.value.name}`, null, null)
      giveLoot(monster.value.drops)
      monster.value.currentHealth = monster.value.health
    }
    setTimeout(combatLoop, 100)
  }
}

function rollPlayerDamage(playerAttack: number, playerStrength: number, enemyDefense: number) {
  const maxDamage = Math.max(0, (playerAttack * playerStrength + 20) - (enemyDefense * 0.5)) // !HARD CODED
  const hitDamage = Math.floor(Math.random() * (maxDamage + 1))
  monster.value.currentHealth -= hitDamage
  rolledDamage.value = hitDamage
  return hitDamage
}

function rollMonsterDamage(monsterAttack: number, monsterStrength: number, playerDefense: number) {
  const maxDamage = Math.max(0, (monsterAttack * monsterStrength + 2) - (playerDefense * 0.5))
  const hitDamage = Math.floor(Math.random() * (maxDamage + 1))
  player.currentHealth += hitDamage
  rolledDamage.value = hitDamage
  return hitDamage
}

function checkIfPlayerIsDead() {
  return player.currentHealth <= 0
}

function checkIfMonsterIsDead() {
  if (monster.value.currentHealth <= 0) {
    // const lootedItems = giveLoot(monster.drops)

    return true
  }
  return false
}

function updateCombatLog(action: string, playerDamage: number | null, monsterDamage: number | null) {
  if (action === 'Player') {
    if (playerDamage === 0) {
      combatLog.value.push({ action: 'Player attacked but missed!' })
    }
    else {
      combatLog.value.push({ action: `Player dealt ${playerDamage} damage to ${monster.value.name}!` })
    }
  }
  else if (action === 'Monster') {
    if (monsterDamage === 0) {
      combatLog.value.push({ action: `${monster.value.name} attacked but missed!` })
    }
    else {
      combatLog.value.push({ action: `${monster.value.name} dealt ${monsterDamage} damage to Player!` })
    }
  }
  else {
    combatLog.value.push({ action })
  }
}

onUnmounted(() => {
  restartCombat()
})
function runAwayFromCombat() {
  isRunningAway.value = true
  setTimeout(() => {
    restartCombat()
    isRunningAway.value = false
  }, 5000)
}
function restartCombat() {
  isCombatActive.value = false
  combatLog.value = []
  lootLog.value = []
  monster.value.currentHealth = monster.value.health
}
function respawn() {
  isRespawning.value = true
  setTimeout(() => {
    player.currentHealth = player.hitpoints
    restartCombat()
    isRespawning.value = false
  }, 1000)
}

function giveLoot(drops: { name: string, chance: number }[] | { name: string, chance: number }) {
  const dropsArray = Array.isArray(drops) ? drops : [drops]
  const lootedItems: string[] = []

  // First, add all guaranteed drops (100% chance)
  dropsArray.forEach((item) => {
    if (item.chance === 100) {
      const existingItem = inventoryStore.findItemInDataBase(item.name)
      if (existingItem) {
        inventoryStore.addItem(existingItem)
        lootedItems.push(item.name)
      }
      else {
        console.log(`Item ${item.name} not found in database`)
      }
    }
  })

  // Now, roll for one random item from the remaining drops
  const remainingDrops = dropsArray.filter(item => item.chance < 100)
  if (remainingDrops.length > 0) {
    const totalChance = remainingDrops.reduce((sum, item) => sum + item.chance, 0)
    const roll = Math.random() * totalChance
    let cumulativeChance = 0

    for (const item of remainingDrops) {
      cumulativeChance += item.chance
      if (roll <= cumulativeChance) {
        if (item.name === '') {
          break
        }
        else {
          lootedItems.push(item.name)
          const existingItem = inventoryStore.findItemInDataBase(item.name)
          if (existingItem) {
            inventoryStore.addItem(existingItem)
          }
        }
        break // Correctly placed break after handling the item
      }
    }
  }

  // Log and return the looted items
  if (lootedItems.length > 0) {
    lootedItems.forEach((item) => {
      const existingLoot = lootLog.value.find(loot => loot.name === item)
      if (existingLoot) {
        existingLoot.count++
      }
      else {
        lootLog.value.push({ name: item, count: 1 })
      }
    })
  }

  return lootedItems
}
</script>

<template>
  <div class="flex flex-col min-h-screen items-center justify-center bg-gray-800 text-white p-4">
    <!-- Combat Area -->
    <div class="w-full max-w-6xl grid grid-cols-3 gap-6">
      <!-- Player Section -->
      <div class="flex flex-col items-center bg-gray-700 p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">
          Player
        </h2>
        <div class="w-32 h-32 bg-green-700 rounded-full mb-4" />
        <p>Health: {{ player.currentHealth }} / {{ player.hitpoints }}</p>
        <p>Attack: {{ player.attack }}</p>
        <p>Strength: {{ player.strength }}</p>
        <p>Defense: {{ player.defense }}</p>
        <p>Weapon Speed: {{ playerWeaponSpeed }} seconds</p>

        <!-- Attack Style Selection -->
        <div class="mt-6 w-full">
          <h3 class="text-xl font-bold mb-2">
            Attack Style
          </h3>
          <div class="flex justify-around">
            <button
              v-for="style in attackStyles"
              :key="style.name"
              class="p-2 rounded-full transition-colors"
              :class="{ 'bg-gray-600': selectedStyle === style.name }"
              @click="setSelectedStyle(style.name)"
            >
              <component
                :is="style.icon"
                class="w-8 h-8"
                :class="style.color"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Combat Actions -->
      <div class="flex flex-col items-center justify-center">
        <div class="text-4xl mb-4">
          ⚔️
        </div>
        <button
          v-if="player.currentHealth > 0"
          class="bg-red-500 text-white px-6 py-3 rounded-lg text-xl font-bold hover:bg-red-600 transition-colors mb-4"
          :class="{ 'bg-red-900': isRespawning }"
          :hidden="isCombatActive || isRespawning"
          @click="startCombat"
        >
          FIGHT!
        </button>
        <button
          v-if="player.currentHealth <= 0"
          class="bg-gray-500 text-white px-6 py-3 rounded-lg text-xl font-bold hover:bg-gray-600 transition-colors mb-4"
          @click="respawn"
        >
          {{ isRespawning ? 'Respawning...' : 'Respawn' }}
        </button>
        <button
          v-else-if="isCombatActive"
          class="bg-gray-500 text-white px-6 py-3 rounded-lg text-xl font-bold hover:bg-gray-600 transition-colors"
          @click="runAwayFromCombat"
        >
          {{ isRunningAway ? 'Running away...' : 'Run away' }}
        </button>
      </div>

      <!-- Monster Section -->
      <div class="flex flex-col items-center bg-gray-700 p-6 rounded-lg shadow-lg">
        <select
          :disabled="isCombatActive"
          class="bg-gray-800 text-white mb-4"
          @change="updateMonster($event.target.value)"
        >
          <option
            v-for="m in sortedMonsters"
            :key="m.name"
            :value="m.name"
          >
            {{ m.name }} - Level {{ m.level }}
          </option>
        </select>
        <h2 class="text-2xl font-bold mb-4">
          {{ monster.name }}
        </h2>
        <div class="w-32 h-32 bg-red-700 rounded-full mb-4" />
        <p>Health: {{ monster.currentHealth }} / {{ monster.health }}</p>
        <p>Attack: {{ monster.attack }}</p>
        <p>Strength: {{ monster.strength }}</p>
        <p>Defense: {{ monster.defense }}</p>
        <p>Weapon Speed: {{ monsterWeaponSpeed }} seconds</p>
      </div>
    </div>

    <!-- Equipment Section -->
    <div class="w-full max-w-6xl mt-8">
      <h2 class="text-2xl font-bold mb-4">
        Equipment
      </h2>
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="item in equipment"
          :key="item.slot"
          class="bg-gray-700 p-4 rounded-lg"
        >
          <h3 class="text-lg font-semibold mb-2">
            {{ item.slot }}
          </h3>
          <p>{{ item.name }}</p>
          <div class="mt-2">
            <span
              v-for="(value, stat) in item.stats"
              :key="stat"
              class="mr-2 text-sm"
            >
              {{ stat }}: +{{ value }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Logs Section -->
    <div class="w-full max-w-6xl grid grid-cols-2 gap-6 mt-8">
      <!-- Combat Log -->
      <div class="bg-gray-700 rounded-lg shadow-lg p-4">
        <h3 class="text-xl font-bold mb-2">
          Combat Log {{ isCombatActive ? ' - Active' : '' }}
        </h3>
        <div class="h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800">
          <ul class="space-y-1">
            <li
              v-for="(log, index) in combatLog.slice().reverse()"
              :key="index"
              class="text-sm"
            >
              <span>{{ log.action }}</span>
              <span
                v-if="log.playerDamage"
                class="text-green-400"
              >Player dealt {{ log.playerDamage }} damage</span>
              <span
                v-if="log.monsterDamage"
                class="text-red-400"
              >Monster dealt {{ log.monsterDamage }} damage</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Loot Log -->
      <div class="bg-gray-700 rounded-lg shadow-lg p-4">
        <h3 class="text-xl font-bold mb-2">
          Loot Log
        </h3>
        <div class="h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800">
          <ul class="space-y-1">
            <li
              v-for="(loot, index) in lootLog"
              :key="index"
              class="text-sm text-yellow-300"
            >
              {{ loot.name }} x{{ loot.count }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add some extra styling if needed */
</style>
