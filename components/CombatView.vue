<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useSkillStore } from '../composable/useSkills'
import monsters from '../data/monsters.json'

const skillStore = useSkillStore()
const combatStats = skillStore.skills.filter(skill => skill.isCombat)

const attack = combatStats.find(stat => stat.name === 'attack')
const defense = combatStats.find(stat => stat.name === 'defense')
const strength = combatStats.find(stat => stat.name === 'strength')
const hitpoints = combatStats.find(stat => stat.name === 'hitpoints')

// Default weapon speed in seconds
const DEFAULT_WEAPON_SPEED = 1

const rolledDamage = ref(0)
const combatLog = ref([]) // Use ref to make it reactive
const isCombatActive = ref(false) // Track combat state

// Player and monster speeds (in seconds per attack)
const playerWeaponSpeed = ref(DEFAULT_WEAPON_SPEED) // Default weapon speed
const monsterWeaponSpeed = ref(2) // Default weapon speed

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
  attack: 1,
  strength: 1,
  defense: 1,
  speed: 3,
  gold: 5,
  xp: 10,
}

let playerNextAttackTime: number = 0 // Time when the player can next attack
let monsterNextAttackTime: number = 0 // Time when the monster can next attack

function startCombat() {
  if (isCombatActive.value) return
  isCombatActive.value = true

  // Initialize next attack times
  const now = Date.now()
  playerNextAttackTime = now + playerWeaponSpeed.value * 1000
  monsterNextAttackTime = now + monsterWeaponSpeed.value * 1000

  combatLoop()
}

function stopCombat() {
  isCombatActive.value = false
}

function combatLoop() {
  if (!isCombatActive.value) return

  const now = Date.now()

  if (player.currentHealth > 0 && monster.currentHealth > 0) {
    if (now >= playerNextAttackTime) {
      // Player attacks
      const playerDamage = rollPlayerDamage(player.attack, player.strength, monster.defense)
      updateCombatLog('Player', playerDamage, 0)
      playerNextAttackTime = now + playerWeaponSpeed.value * 1000 // Schedule next attack
    }

    if (now >= monsterNextAttackTime) {
      // Monster attacks
      const monsterDamage = rollMonsterDamage(monster.attack, monster.strength, player.defense)
      updateCombatLog('Monster', 0, monsterDamage)
      monsterNextAttackTime = now + monsterWeaponSpeed.value * 1000 // Schedule next attack
    }

    if (checkIfPlayerIsDead()) {
      updateCombatLog('Game Over', null, null)
      stopCombat()
      return
    }

    if (checkIfMonsterIsDead()) {
      updateCombatLog('Victory', null, null)
      stopCombat()
      return
    }

    // Continue the combat loop
    setTimeout(combatLoop, 100) // Check every 100ms
  }
}

function rollPlayerDamage(playerAttack, playerStrength, enemyDefense) {
  const maxDamage = Math.max(0, (playerAttack * playerStrength + 2) - (enemyDefense * 0.5))
  const hitDamage = Math.floor(Math.random() * (maxDamage + 1)) // +1 to include maxDamage
  monster.currentHealth -= hitDamage
  rolledDamage.value = hitDamage
  console.log(rolledDamage.value)
  return hitDamage
}

function rollMonsterDamage(monsterAttack, monsterStrength, playerDefense) {
  const maxDamage = Math.max(0, (monsterAttack * monsterStrength + 2) - (playerDefense * 0.5))
  const hitDamage = Math.floor(Math.random() * (maxDamage + 1)) // +1 to include maxDamage
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

function updateCombatLog(action, playerDamage, monsterDamage) {
  combatLog.value.push({
    action,
    playerDamage: playerDamage || 0,
    monsterDamage: monsterDamage || 0,
  })
}

// Clean up on component unmount
onUnmounted(() => {
  stopCombat()
})
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-gray-800 text-white p-4">
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
        <section>
          <ul>
            <li
              v-for="(log, index) in combatLog"
              :key="index"
            >
              <strong>{{ log.action }}:</strong>
              <span v-if="log.playerDamage">Player dealt {{ log.playerDamage }} damage</span>
              <span v-if="log.monsterDamage">Monster dealt {{ log.monsterDamage }} damage</span>
            </li>
          </ul>
        </section>
        <button
          class="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
          :disabled="isCombatActive"
          @click="startCombat"
        >
          Start Combat
        </button>
        <button
          class="bg-gray-500 text-white px-4 py-2 rounded-lg mt-4 ml-2"
          :disabled="!isCombatActive"
          @click="stopCombat"
        >
          Stop Combat
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add some extra styling if needed */
</style>
