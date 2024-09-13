<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useSkillStore } from '../composable/useSkills'

const skillStore = useSkillStore()
const combatStats = skillStore.skills.filter(skill => skill.isCombat)

const attack = combatStats.find(stat => stat.name === 'attack')
const defense = combatStats.find(stat => stat.name === 'defense')
const strength = combatStats.find(stat => stat.name === 'strength')
const hitpoints = combatStats.find(stat => stat.name === 'hitpoints')

const DEFAULT_WEAPON_SPEED = 1
const isRespawning = ref(false)
const rolledDamage = ref(0)
const combatLog = ref<Array<{ action: string, playerDamage?: number, monsterDamage?: number }>>([])
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

const monster = {
  id: 1,
  name: 'Goblin',
  health: 5,
  currentHealth: 5,
  attack: 10,
  strength: 1,
  defense: 1,
  speed: 3,
  gold: 5,
  xp: 10,
}

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

function combatLoop() {
  if (!isCombatActive.value) return
  const now = Date.now()

  if (player.currentHealth > 0 && monster.currentHealth > 0) {
    if (now >= playerNextAttackTime) {
      const playerDamage = rollPlayerDamage(player.attack, player.strength, monster.defense)
      updateCombatLog('Player', playerDamage, 0)
      playerNextAttackTime = now + playerWeaponSpeed.value * 1000
    }

    if (now >= monsterNextAttackTime) {
      const monsterDamage = rollMonsterDamage(monster.attack, monster.strength, player.defense)
      updateCombatLog('Monster', 0, monsterDamage)
      monsterNextAttackTime = now + monsterWeaponSpeed.value * 1000
    }

    if (checkIfPlayerIsDead()) {
      restartCombat()
      updateCombatLog('You Died', null, null)

      return
    }

    if (checkIfMonsterIsDead()) {
      updateCombatLog(`You Killed ${monster.name}`, null, null)
      restartCombat()
      return
    }
    setTimeout(combatLoop, 100)
  }
}

function rollPlayerDamage(playerAttack: number, playerStrength: number, enemyDefense: number) {
  const maxDamage = Math.max(0, (playerAttack * playerStrength + 2) - (enemyDefense * 0.5))
  const hitDamage = Math.floor(Math.random() * (maxDamage + 1))
  monster.currentHealth -= hitDamage
  rolledDamage.value = hitDamage
  console.log(rolledDamage.value)
  return hitDamage
}

function rollMonsterDamage(monsterAttack: number, monsterStrength: number, playerDefense: number) {
  const maxDamage = Math.max(0, (monsterAttack * monsterStrength + 2) - (playerDefense * 0.5))
  const hitDamage = Math.floor(Math.random() * (maxDamage + 1))
  player.currentHealth -= hitDamage
  rolledDamage.value = hitDamage
  return hitDamage
}

function checkIfPlayerIsDead() {
  return player.currentHealth <= 0
}

function checkIfMonsterIsDead() {
  return monster.currentHealth <= 0
}

function updateCombatLog(action: string, playerDamage: number | null, monsterDamage: number | null) {
  if (action === 'Player') {
    if (playerDamage === 0) {
      combatLog.value.push({ action: 'Player attacked but missed!' })
    }
    else {
      combatLog.value.push({ action: `Player dealt ${playerDamage} damage to ${monster.name}!` })
    }
  }
  else if (action === 'Monster') {
    if (monsterDamage === 0) {
      combatLog.value.push({ action: `${monster.name} attacked but missed!` })
    }
    else {
      combatLog.value.push({ action: `${monster.name} dealt ${monsterDamage} damage to Player!` })
    }
  }
  else {
    combatLog.value.push({ action })
  }
}

onUnmounted(() => {
  restartCombat()
})

function restartCombat() {
  isCombatActive.value = false
  combatLog.value = []
  monster.currentHealth = monster.health
}
function respawn() {
  isRespawning.value = true
  setTimeout(() => {
    player.currentHealth = player.hitpoints
    restartCombat()
    isRespawning.value = false
  }, 10000)
}
</script>

<template>
  <div class="flex flex-col h-screen items-center justify-center bg-gray-800 text-white p-4">
    <!-- Combat Area -->
    <div class="max-w-5xl grid grid-cols-2 gap-6">
      <!-- Player Section -->
      <div class="flex flex-col items-center bg-green-500 p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">
          Player
        </h2>
        <div class="w-32 h-32 bg-green-700 rounded-full mb-4">
          <!-- Player Avatar -->
        </div>
        <div class="space-y-2">
          <p>Health: {{ player.currentHealth }} / {{ player.hitpoints }}</p>
          <p>Attack: {{ player.attack }}</p>
          <p>Strength: {{ player.strength }}</p>
          <p>Defense: {{ player.defense }}</p>
          <p>Weapon Speed: {{ playerWeaponSpeed }} seconds</p>
        </div>
      </div>

      <!-- Monster Section -->
      <div class="flex flex-col items-center bg-red-500 p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">
          Monster
        </h2>
        <div class="w-32 h-32 bg-red-700 rounded-full mb-4">
          <!-- Monster Avatar -->
        </div>
        <div class="space-y-2">
          <p>{{ monster.name }}</p>
          <p>Health: {{ monster.currentHealth }} / {{ monster.health }}</p>
          <p>Attack: {{ monster.attack }}</p>
          <p>Defense: {{ monster.defense }}</p>
          <p>Weapon Speed: {{ monsterWeaponSpeed }} seconds</p>
        </div>
      </div>

      <div class="flex justify-center">
        <button
          v-if="player.currentHealth >= 0"
          class="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
          :class="{ 'bg-red-900': isRespawning }"
          :disabled="isCombatActive || isRespawning"
          @click="startCombat"
        >
          Start Combat
        </button>
        <button
          v-if="player.currentHealth <= 0"
          class="bg-gray-500 text-white px-4 py-2 rounded-lg mt-4 ml-2"
          @click="respawn"
        >
          {{ isRespawning ? 'Respawning...' : 'Respawn' }}
        </button>
        <button
          v-else
          class="bg-gray-500 text-white px-4 py-2 rounded-lg mt-4 ml-2"
          :disabled="!isCombatActive"
          @click="restartCombat"
        >
          Run Away
        </button>
      </div>
    </div>
    <section>
      <ul>
        <li
          v-for="(log, index) in combatLog"
          :key="index"
        >
          <strong>{{ log.action }}</strong>
          <span v-if="log.playerDamage">Player dealt {{ log.playerDamage }} damage</span>
          <span v-if="log.monsterDamage">Monster dealt {{ log.monsterDamage }} damage</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
/* Add some extra styling if needed */
</style>
