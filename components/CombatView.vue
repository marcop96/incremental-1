<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue'
import { useSkillStore } from '../composable/useSkills'
import monsters from '../data/monsters.json'
import { useInventoryStore } from '~/composable/useInventory'
import { usePlayerStore } from '~/composable/usePlayer'

const skillStore = useSkillStore()
const inventoryStore = useInventoryStore()
const playerStore = usePlayerStore()

const combatStats = skillStore.skills.filter(skill => skill.isCombat)
const sortedMonsters = computed(() => monsters.sort((a, b) => a.level - b.level))
const sortedCombatLog = computed(() => combatLog.value.slice().reverse())

function imgUrl(name: string) {
  return new URL(`../assets/monsters/${name}.webp`, import.meta.url).href
}

const isRunningAway = ref(false)
const DEFAULT_WEAPON_SPEED = 1
const isRespawning = ref(false)
const rolledDamage = ref(0)
const combatLog = ref<Array<{ action: string, playerDamage?: number, monsterDamage?: number }>>([])
const lootLog = ref<Array<{ name: string, count: number }>>([])
const isCombatActive = ref(false)

const playerWeaponSpeed = ref(DEFAULT_WEAPON_SPEED)
const monsterWeaponSpeed = ref(2)

const MAX_COMBAT_LOG_ENTRIES = 10

const player = computed(() => ({
  attack: combatStats.find(stat => stat.name === 'attack')?.level || 1,
  defense: combatStats.find(stat => stat.name === 'defense')?.level || 1,
  strength: combatStats.find(stat => stat.name === 'strength')?.level || 1,
  hitpoints: combatStats.find(stat => stat.name === 'hitpoints')?.level || 1,
  currentHealth: (combatStats.find(stat => stat.name === 'hitpoints')?.level || 1) * 10,
}))

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
  xp: 10000,
  drops: [
    { name: 'Bones', chance: 100 },
    { name: 'sword', chance: 10 },
    { name: 'ultra rare', chance: 1 },
    { name: '', chance: 60 },
  ],
})

const attackStyles = [
  { name: 'attack', icon: 'IconSword', color: 'text-red-500', id: 6 },
  { name: 'strength', icon: 'IconArm', color: 'text-yellow-500', id: 7 },
  { name: 'defense', icon: 'IconShield', color: 'text-blue-500', id: 8 },
]

const selectedAttackStyle = ref(attackStyles[0])

let playerNextAttackTime = 0
let monsterNextAttackTime = 0

function startCombat() {
  if (isCombatActive.value) return
  isCombatActive.value = true
  const now = Date.now()
  playerNextAttackTime = now + playerWeaponSpeed.value * 1000
  monsterNextAttackTime = now + monsterWeaponSpeed.value * 1000
  combatLoop()
}

function updateMonster(selectedMonsterName: string) {
  const selectedMonster = monsters.find(m => m.name === selectedMonsterName)
  if (selectedMonster) {
    monster.value = { ...selectedMonster, currentHealth: selectedMonster.health }
    restartCombat()
  }
}

// Asynchronous attack loop
async function combatLoop() {
  if (!isCombatActive.value) return

  // Wait for both player and monster attacks asynchronously
  try {
    await Promise.all([handlePlayerAttack(), handleMonsterAttack()])
  }
  catch (error) {
    console.error('Combat Error:', error)
  }

  if (checkIfPlayerIsDead()) {
    updateCombatLog('You Died', null, null)
    return
  }

  if (checkIfMonsterIsDead()) {
    handleMonsterDeath()
  }

  // Run next loop after a short delay
  if (isCombatActive.value) {
    setTimeout(combatLoop, 100)
  }
}

// Handle player's attack asynchronously
async function handlePlayerAttack() {
  const now = Date.now()
  if (now >= playerNextAttackTime) {
    const playerDamage = rollDamage(player.value.attack, player.value.strength, monster.value.defense)
    monster.value.currentHealth -= playerDamage
    updateCombatLog('Player', playerDamage, 0)
    playerNextAttackTime = now + playerWeaponSpeed.value * 1000
  }
  // Wait for the player weapon speed delay
  await new Promise(resolve => setTimeout(resolve, playerWeaponSpeed.value * 1000))
}

// Handle monster's attack asynchronously
async function handleMonsterAttack() {
  const now = Date.now()
  if (now >= monsterNextAttackTime) {
    const monsterDamage = rollDamage(monster.value.attack, monster.value.strength, player.value.defense)
    player.value.currentHealth -= monsterDamage
    updateCombatLog('Monster', 0, monsterDamage)
    monsterNextAttackTime = now + monsterWeaponSpeed.value * 1000
  }
  // Wait for the monster weapon speed delay
  await new Promise(resolve => setTimeout(resolve, monsterWeaponSpeed.value * 1000))
}

function rollDamage(attack: number, strength: number, defense: number) {
  const maxDamage = Math.max(0, (attack * strength + 20) - (defense * 0.5))
  return Math.floor(Math.random() * (maxDamage + 1))
}

function checkIfPlayerIsDead() {
  return player.value.currentHealth <= 0
}

function checkIfMonsterIsDead() {
  return monster.value.currentHealth <= 0
}

function handleMonsterDeath() {
  playerStore.addExperience(selectedAttackStyle.value.id, Math.floor(monster.value.xp * 0.66))
  playerStore.addExperience(9, Math.floor(monster.value.xp * 0.33))
  updateCombatLog(`You Killed ${monster.value.name}`, null, null)
  giveLoot(monster.value.drops)
  monster.value.currentHealth = monster.value.health
}

function updateCombatLog(action: string, playerDamage: number | null, monsterDamage: number | null) {
  if (combatLog.value.length >= MAX_COMBAT_LOG_ENTRIES) {
    combatLog.value.splice(0, 1)
  }
  const message = action === 'Player'
    ? `Player dealt ${playerDamage} damage to ${monster.value.name}!`
    : action === 'Monster'
      ? `${monster.value.name} dealt ${monsterDamage} damage to Player!`
      : action
  combatLog.value.push({ action: message })
}

onUnmounted(() => restartCombat())

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
    player.value.currentHealth = player.value.hitpoints
    restartCombat()
    isRespawning.value = false
  }, 1000)
}

function giveLoot(drops) {
  const lootedItems = []
  drops.forEach((drop) => {
    const roll = Math.random() * 100
    if (roll <= drop.chance && drop.name) {
      const existingItem = inventoryStore.findItemInDataBase(drop.name)
      if (existingItem) inventoryStore.addItem(existingItem)
      lootedItems.push(drop.name)
    }
  })
  if (lootedItems.length) {
    lootedItems.forEach((item) => {
      const existingLoot = lootLog.value.find(loot => loot.name === item)
      existingLoot ? existingLoot.count++ : lootLog.value.push({ name: item, count: 1 })
    })
  }
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
              class="bg-blue-500 p-2 rounded-full transition-colors"
              :class="{ 'bg-red-500': selectedAttackStyle.name === style.name }"
              @click="selectedAttackStyle = style"
            >
              {{ style.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Combat Actions -->
      <div class="flex flex-col items-center justify-center">
        <div class="text-4xl mb-4">
          {{ isCombatActive ? '🏃‍♂️' : '⚔️' }}
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
        <img
          class="w-32 h-32  rounded-full mb-4"
          :src="imgUrl(monster.name)"
        >

        <p>Health: {{ monster.currentHealth }} / {{ monster.health }}</p>
        <p>Attack: {{ monster.attack }}</p>
        <p>Strength: {{ monster.strength }}</p>
        <p>Defense: {{ monster.defense }}</p>
        <p>Weapon Speed: {{ monsterWeaponSpeed }} seconds</p>
      </div>
    </div>

    <!-- Equipment Section -->
    <!-- <div class="w-full max-w-6xl mt-8">
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
    </div> -->

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
              v-for="(log, index) in sortedCombatLog"
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
