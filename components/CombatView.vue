<script setup lang="ts">
  import { ref, computed, onUnmounted } from 'vue'
  import monstersData from '../data/monsters.json'
  import { useSkillStore } from '../composable/useSkills'
  import { useInventoryStore } from '~/composable/useInventory'
  import { usePlayerStore } from '~/composable/usePlayer'
  import { Progress } from '~/components/ui/progress'

  /* =======================
     CONFIGURATION CONSTANTS
  ========================== */
  const DEFAULT_WEAPON_SPEED = 1
  const MONSTER_RESPAWN_DELAY = 1
  const MAX_COMBAT_LOG_ENTRIES = 10

  /* =======================
     Define Interfaces & Types
  ========================== */
  interface Monster {
    id: number
    name: string
    level?: number
    health: number
    currentHealth: number
    attack: number
    strength: number
    defense: number
    speed: number
    gold: number
    xp: number
    drops: Array<{ name: string; chance: number }>
  }

  /* =======================
     Cast Imported Data
  ========================== */
  const monsters = monstersData as Monster[]

  /* =======================
     Stores and Data
  ========================== */
  const skillStore = useSkillStore()
  const inventoryStore = useInventoryStore()
  const playerStore = usePlayerStore()

  // Filter combat-related skills
  const combatStats = skillStore.skills.filter(skill => skill.isCombat)

  // Player base stats computed from combat stats (read-only)
  const playerBase = computed(() => ({
    attack: combatStats.find(stat => stat.name === 'attack')?.level || 1,
    defense: combatStats.find(stat => stat.name === 'defense')?.level || 1,
    strength: combatStats.find(stat => stat.name === 'strength')?.level || 1,
    hitpoints: combatStats.find(stat => stat.name === 'hitpoints')?.level || 1,
  }))

  // Separate mutable state for the player's current health
  const playerCurrentHealth = ref(playerBase.value.hitpoints * 10)

  // Sorted monsters (make a shallow copy before sorting)
  const sortedMonsters = computed(() => [...monsters].sort((a, b) => (a.level || 0) - (b.level || 0)))

  // Combat log entries now store timestamp and message separately
  const combatLog = ref<Array<{ timestamp: number, message: string, playerDamage?: number, monsterDamage?: number, type?: string }>>([])
  const sortedCombatLog = computed(() => combatLog.value.slice().reverse())

  /* =======================
     Utility Functions
  ========================== */
  // Returns the image URL for a given monster name
  function imgUrl(name: string) {
    return new URL(`../assets/monsters/${name}.webp`, import.meta.url).href
  }

  // Logging helper that adds a timestamp and type to combat log entries
  function logCombat(action: string, playerDamage: number | null, monsterDamage: number | null): void {
    const timestamp = Date.now()
    let type: string = 'other'
    let message: string
    if (action === 'Player') {
      message = `Player dealt ${playerDamage} damage to ${monster.value.name} !`
      type = 'player'
    } else if (action === 'Monster') {
      message = `${monster.value.name} dealt ${monsterDamage} damage to Player!`
      type = 'monster'
    } else {
      message = action
    }
    combatLog.value.push({ timestamp, message, playerDamage, monsterDamage, type })
    if (combatLog.value.length > MAX_COMBAT_LOG_ENTRIES) {
      combatLog.value.shift()
    }
  }

  /* =======================
     State Variables
  ========================== */
  const isRunningAway = ref(false)
  const isRespawning = ref(false)
  const isCombatActive = ref(false)
  const isMonsterRespawning = ref(false)
  const lootLog = ref<Array<{ name: string, count: number }>>([])

  // Weapon speeds
  const playerWeaponSpeed = ref(DEFAULT_WEAPON_SPEED)
  const monsterWeaponSpeed = ref(1)

  // Health percentages
  const playerHealthPercentage = computed(() => (playerCurrentHealth.value / (playerBase.value.hitpoints * 10)) * 100)
  const monsterHealthPercentage = computed(() => (monster.value.currentHealth / monster.value.health) * 100)

  // Define reactive monster state with the Monster interface
  const monster = ref<Monster>({
    id: 1,
    name: 'Goblin',
    health: 1,
    currentHealth: 1,
    attack: 5,
    strength: 3,
    defense: 2,
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

  // Attack styles and selected style
  const attackStyles = [
    { name: 'attack', icon: 'IconSword', color: 'text-red-500', id: 6 },
    { name: 'strength', icon: 'IconArm', color: 'text-yellow-500', id: 7 },
    { name: 'defense', icon: 'IconShield', color: 'text-blue-500', id: 8 },
  ]
  const selectedAttackStyle = ref(attackStyles[0])

  // Timeout ID for the combat loop (to clear on unmount)
  let combatTimeoutId: ReturnType<typeof setTimeout>

  // Variables for attack timing
  let playerNextAttackTime = 0
  let monsterNextAttackTime = 0

  /* =======================
     Combat Logic Functions
  ========================== */
  function startCombat(): void {
    if (isCombatActive.value || isMonsterRespawning.value) return
    isCombatActive.value = true
    const now = Date.now()
    playerNextAttackTime = now + playerWeaponSpeed.value * 1000
    monsterNextAttackTime = now + monsterWeaponSpeed.value * 1000
    combatLoop()
  }
  function runAwayFromCombat() {
    isRunningAway.value = true
    setTimeout(() => {
      restartCombat()
      isRunningAway.value = false
    }, 5000)
  }
  function updateMonster(selectedMonsterName: string): void {
    const selectedMonster = monsters.find(m => m.name === selectedMonsterName)
    if (selectedMonster) {
      // Update monster state and reset health
      monster.value = { ...selectedMonster, currentHealth: selectedMonster.health }
      restartCombat()
    }
  }

  // Handler for the select change event
  function handleMonsterChange(e: Event): void {
    const target = e.target as HTMLSelectElement
    updateMonster(target.value)
  }

  // Asynchronous combat loop using independent timers
  function combatLoop(): void {
    if (!isCombatActive.value) return
    const now = Date.now()
    if (now >= playerNextAttackTime && monster.value.currentHealth > 0) {
      handlePlayerAttack().then(() => { /* After player attack */ })
    }
    if (now >= monsterNextAttackTime && playerCurrentHealth.value > 0) {
      handleMonsterAttack().then(() => { /* After monster attack */ })
    }
    combatTimeoutId = setTimeout(combatLoop, 100)
  }

  async function handlePlayerAttack(): Promise<void> {
    const now = Date.now()
    if (now >= playerNextAttackTime) {
      const playerDamage = rollDamage(playerBase.value.attack, playerBase.value.strength, monster.value.defense)
      // Subtract damage and clamp monster health to zero
      monster.value.currentHealth = Math.max(0, monster.value.currentHealth - playerDamage)
      logCombat('Player', playerDamage, 0)
      if (monster.value.currentHealth <= 0) {
        handleMonsterDeath()
        return
      }
      playerNextAttackTime = now + playerWeaponSpeed.value * 1000
    }
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  async function handleMonsterAttack(): Promise<void> {
    const now = Date.now()
    if (now >= monsterNextAttackTime && monster.value.currentHealth > 0) {
      const monsterDamage = rollDamage(monster.value.attack, monster.value.strength, playerBase.value.defense)
      // Subtract damage and clamp player health to zero
      playerCurrentHealth.value = Math.max(0, playerCurrentHealth.value - monsterDamage)
      logCombat('Monster', 0, monsterDamage)
      if (playerCurrentHealth.value <= 0) {
        logCombat('You Died', null, null)
        isCombatActive.value = false
        return
      }
      monsterNextAttackTime = now + monsterWeaponSpeed.value * 1000
    }
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Enhanced damage calculation with 20% variance
  function rollDamage(attack: number, strength: number, defense: number): number {
    const baseDamage = Math.max(0, (attack * strength) - (defense * 0.5))
    const variance = baseDamage * 0.2
    const damage = baseDamage + (Math.random() * variance - variance / 2)
    return Math.floor(damage)
  }

  function handleMonsterDeath(): void {
    if (isRunningAway.value) return
    startMonsterRespawn() // Begin monster respawn timer
    playerStore.addExperience(selectedAttackStyle.value.id, Math.floor(monster.value.xp * 0.66))
    playerStore.addExperience(9, Math.floor(monster.value.xp * 0.33))
    logCombat(`You Killed ${monster.value.name}`, null, null)
    giveLoot(monster.value.drops)
  }

  function startMonsterRespawn(): void {
    isMonsterRespawning.value = true
    setTimeout(() => {
      monster.value.currentHealth = monster.value.health
      isMonsterRespawning.value = false
      const now = Date.now()
      playerNextAttackTime = now + playerWeaponSpeed.value * 1000
      monsterNextAttackTime = now + monsterWeaponSpeed.value * 1000
      startCombat()
    }, MONSTER_RESPAWN_DELAY)
  }

  function restartCombat(): void {
    isCombatActive.value = false
    combatLog.value = []
    lootLog.value = []
    if (combatTimeoutId) clearTimeout(combatTimeoutId)
    monster.value.currentHealth = monster.value.health
  }

  function respawn(): void {
    isRespawning.value = true
    setTimeout(() => {
      playerCurrentHealth.value = playerBase.value.hitpoints * 10
      restartCombat()
      isRespawning.value = false
    }, 1000)
  }

  function giveLoot(drops: Array<{ name: string, chance: number }>): void {
    const lootedItems: string[] = []
    drops.forEach(drop => {
      const roll = Math.random() * 100
      if (roll <= drop.chance && drop.name) {
        const existingItem = inventoryStore.findItemInDataBase(drop.name)
        if (existingItem) inventoryStore.addItem(existingItem)
        lootedItems.push(drop.name)
      }
    })
    if (lootedItems.length) {
      lootedItems.forEach(item => {
        const existingLoot = lootLog.value.find(loot => loot.name === item)
        if (existingLoot) {
          existingLoot.count++
        } else {
          lootLog.value.push({ name: item, count: 1 })
        }
      })
    }
  }

  // Clean up on component unmount
  onUnmounted(() => {
    if (combatTimeoutId) clearTimeout(combatTimeoutId)
    restartCombat()
  })
</script>

<template>
  <div class="flex flex-col min-h-screen items-center justify-center bg-gray-800 text-white p-4">
    <!-- Combat Area -->
    <div class="w-full max-w-6xl grid grid-cols-3 gap-6">
      <!-- Player Section -->
      <div class="flex flex-col items-center bg-gray-700 p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">Player</h2>
        <div class="w-32 h-32 bg-green-700 rounded-full mb-4"></div>
        <p>Health: {{ playerCurrentHealth }} / {{ playerBase.hitpoints * 10 }}</p>
        <div class="health-bar-container">
          <div v-if="playerCurrentHealth > 0" class="health-bar" :style="{ width: playerHealthPercentage + '%' }"></div>
        </div>
        <p>Attack: {{ playerBase.attack }}</p>
        <p>Strength: {{ playerBase.strength }}</p>
        <p>Defense: {{ playerBase.defense }}</p>
        <p>Weapon Speed: {{ playerWeaponSpeed }} seconds</p>
        <!-- Attack Style Selection -->
        <div class="mt-6 w-full">
          <h3 class="text-xl font-bold mb-2">Attack Style</h3>
          <div class="flex justify-around">
            <button v-for="style in attackStyles" :key="style.name"
              class="bg-blue-500 p-2 rounded-full transition-colors"
              :class="{ 'bg-red-500': selectedAttackStyle.name === style.name }" @click="selectedAttackStyle = style">
              {{ style.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Combat Actions -->
      <div class="flex flex-col items-center justify-center">
        <select :disabled="isCombatActive" class="bg-gray-800 text-white mb-4" @change="handleMonsterChange">
          <option v-for="m in sortedMonsters" :key="m.name" :value="m.name">
            {{ m.name }} - Level {{ m.level }}
          </option>
        </select>
        <div class="text-4xl mb-4">
          {{ isCombatActive && !isMonsterRespawning ? '🏃‍♂️' : '' }}
          {{ isMonsterRespawning ? 'placeholder spinner' : '' }}
        </div>
        <button v-if="playerCurrentHealth > 0"
          class="bg-red-500 text-white px-6 py-3 rounded-lg text-xl font-bold hover:bg-red-600 transition-colors mb-4"
          :class="{ 'bg-red-900': isRespawning }" :hidden="isCombatActive || isRespawning || isMonsterRespawning"
          @click="startCombat">
          FIGHT!
        </button>
        <button v-if="playerCurrentHealth <= 0"
          class="bg-gray-500 text-white px-6 py-3 rounded-lg text-xl font-bold hover:bg-gray-600 transition-colors mb-4"
          @click="respawn">
          {{ isRespawning ? 'Respawning...' : 'Respawn' }}
        </button>
        <button v-else-if="isCombatActive || isMonsterRespawning"
          class="bg-gray-500 text-white px-6 py-3 rounded-lg text-xl font-bold hover:bg-gray-600 transition-colors"
          @click="runAwayFromCombat">
          {{ isRunningAway ? 'Running away...' : 'Run away' }}
        </button>
      </div>

      <!-- Monster Section -->
      <div class="flex flex-col items-center bg-gray-700 p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">{{ monster.name }}</h2>
        <img class="w-32 h-32 rounded-full mb-4" :src="imgUrl(monster.name)" alt="Monster Image">
        <p :class="{ 'text-red-500': monster.currentHealth < 0 }">
          Health: {{ monster.currentHealth }} / {{ monster.health }}
        </p>
        <div class="health-bar-container">
          <div v-if="monster.currentHealth > 0" class="health-bar" :style="{ width: monsterHealthPercentage + '%' }">
          </div>
        </div>
        <p>Attack: {{ monster.attack }}</p>
        <p>Strength: {{ monster.strength }}</p>
        <p>Defense: {{ monster.defense }}</p>
        <p>Weapon Speed: {{ monsterWeaponSpeed }} seconds</p>
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
            <li v-for="(log, index) in sortedCombatLog" :key="index" class="text-sm">
              <span class="text-white">{{ new Date(log.timestamp).toLocaleTimeString() }}</span>
              <span> - </span>
              <span :class="{
                'text-green-400': log.type === 'player',
                'text-red-400': log.type === 'monster',
                'text-white': log.type === 'other'
              }">
                {{ log.message }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Loot Log -->
      <div class="bg-gray-700 rounded-lg shadow-lg p-4">
        <h3 class="text-xl font-bold mb-2">Loot Log</h3>
        <div class="h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800">
          <ul class="space-y-1">
            <li v-for="(loot, index) in lootLog" :key="index" class="text-sm text-yellow-300">
              {{ loot.name }} x{{ loot.count }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .health-bar-container {
    width: 100%;
    height: 20px;
    background-color: #ac1f1f;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .health-bar {
    height: 100%;
    background-color: #4caf50;
    transition: width 0.3s;
  }
</style>
