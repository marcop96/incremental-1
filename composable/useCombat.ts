import { defineStore } from 'pinia'
import { ref, computed, onUnmounted } from 'vue'
import { useSkillStore } from '../composable/useSkills'
import { useInventoryStore } from '~/composable/useInventory'
import { usePlayerStore } from '~/composable/usePlayer'

/* =======================
   CONFIGURATION CONSTANTS
========================== */
const DEFAULT_WEAPON_SPEED = 1        // In seconds
const MONSTER_RESPAWN_DELAY = 1       // In milliseconds (for testing – adjust for production)
const MAX_COMBAT_LOG_ENTRIES = 10

/* =======================
   Define Interfaces & Types
========================== */
export interface Monster {
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
   Define and Export the Combat Store
========================== */
export const useCombatStore = defineStore('combat', () => {
  // Import other stores
  const skillStore = useSkillStore()
  const inventoryStore = useInventoryStore()
  const playerStore = usePlayerStore()

  // Filter combat-related skills from skillStore
  const combatStats = skillStore.skills.filter(skill => skill.isCombat)

  // Player base stats computed from combat stats (read-only)
  const playerBase = computed(() => ({
    attack: combatStats.find(stat => stat.name === 'attack')?.level || 1,
    defense: combatStats.find(stat => stat.name === 'defense')?.level || 1,
    strength: combatStats.find(stat => stat.name === 'strength')?.level || 1,
    hitpoints: combatStats.find(stat => stat.name === 'hitpoints')?.level || 1,
  }))

  // Player's current health (this could also belong to your player store)
  const playerCurrentHealth = ref(playerBase.value.hitpoints * 10)

  // Combat log state (each entry stores a timestamp and message, plus optional damage values and a type)
  const combatLog = ref<Array<{ timestamp: number; message: string; playerDamage?: number; monsterDamage?: number; type?: string }>>([])
  const sortedCombatLog = computed(() => combatLog.value.slice().reverse())

  // Loot log state
  const lootLog = ref<Array<{ name: string; count: number }>>([])

  // Timing variables for attacks
  const playerNextAttackTime = ref(0)
  const monsterNextAttackTime = ref(0)
  let combatTimeoutId: ReturnType<typeof setTimeout> | null = null

  // Weapon speeds
  const playerWeaponSpeed = ref(DEFAULT_WEAPON_SPEED)
  const monsterWeaponSpeed = ref(1)

  // Health percentages computed from current health values
  const playerHealthPercentage = computed(() => (playerCurrentHealth.value / (playerBase.value.hitpoints * 10)) * 100)
  const monsterHealthPercentage = computed(() => (monster.value.currentHealth / monster.value.health) * 100)

  // Define reactive monster state (default monster: Goblin)
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

  // Attack styles and selected style (these could also be defined in a separate module)
  const attackStyles = [
    { name: 'attack', icon: 'IconSword', color: 'text-red-500', id: 6 },
    { name: 'strength', icon: 'IconArm', color: 'text-yellow-500', id: 7 },
    { name: 'defense', icon: 'IconShield', color: 'text-blue-500', id: 8 },
  ]
  const selectedAttackStyle = ref(attackStyles[0])

  // Combat state flags
  const isCombatActive = ref(false)
  const isMonsterRespawning = ref(false)
  const isRunningAway = ref(false)
  const isRespawning = ref(false)

  /* =======================
     Utility: Logging Combat Events
  =========================== */
  function logCombat(action: string, playerDamage: number | null, monsterDamage: number | null): void {
    const timestamp = Date.now()
    let type: string = 'other'
    let message: string = ''
    if (action === 'Player') {
      message = `Player dealt ${playerDamage} damage to ${monster.value.name}!`
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
     Combat Logic Functions
  =========================== */
  function combatLoop(): void {
    if (!isCombatActive.value) return
    const now = Date.now()
    if (now >= playerNextAttackTime.value && monster.value.currentHealth > 0) {
      handlePlayerAttack().then(() => { /* After player attack */ })
    }
    if (now >= monsterNextAttackTime.value && playerCurrentHealth.value > 0) {
      handleMonsterAttack().then(() => { /* After monster attack */ })
    }
    combatTimeoutId = setTimeout(combatLoop, 100)
  }

  async function handlePlayerAttack(): Promise<void> {
    const now = Date.now()
    if (now >= playerNextAttackTime.value) {
      const playerDamage = rollDamage(playerBase.value.attack, playerBase.value.strength, monster.value.defense)
      // Subtract damage and ensure monster health doesn't go below zero
      monster.value.currentHealth = Math.max(0, monster.value.currentHealth - playerDamage)
      logCombat('Player', playerDamage, 0)
      if (monster.value.currentHealth <= 0) {
        handleMonsterDeath()
        return
      }
      playerNextAttackTime.value = now + playerWeaponSpeed.value * 1000
    }
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  async function handleMonsterAttack(): Promise<void> {
    const now = Date.now()
    if (now >= monsterNextAttackTime.value && monster.value.currentHealth > 0) {
      const monsterDamage = rollDamage(monster.value.attack, monster.value.strength, playerBase.value.defense)
      // Subtract damage and ensure player health doesn't go below zero
      playerCurrentHealth.value = Math.max(0, playerCurrentHealth.value - monsterDamage)
      logCombat('Monster', 0, monsterDamage)
      if (playerCurrentHealth.value <= 0) {
        logCombat('You Died', null, null)
        isCombatActive.value = false
        return
      }
      monsterNextAttackTime.value = now + monsterWeaponSpeed.value * 1000
    }
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Damage calculation with 20% variance
  function rollDamage(attack: number, strength: number, defense: number): number {
    const baseDamage = Math.max(0, (attack * strength) - (defense * 0.5))
    const variance = baseDamage * 0.2
    const damage = baseDamage + (Math.random() * variance - variance / 2)
    return Math.floor(damage)
  }

  function handleMonsterDeath(): void {
    if (isRunningAway.value) return
    startMonsterRespawn()
    // Award experience using values from selected attack style
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
      playerNextAttackTime.value = now + playerWeaponSpeed.value * 1000
      monsterNextAttackTime.value = now + monsterWeaponSpeed.value * 1000
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
  function startCombat() {
    if (isCombatActive.value || isMonsterRespawning.value) return
    isCombatActive.value = true
    const now = Date.now()
    playerNextAttackTime = now + playerWeaponSpeed.value * 1000
    monsterNextAttackTime = now + monsterWeaponSpeed.value * 1000
    combatLoop()
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

  function cleanup(): void {
    if (combatTimeoutId) clearTimeout(combatTimeoutId)
    restartCombat()
  }

  // Optionally, you could hook onUnmounted() here if the store is used within components.
  // onUnmounted(() => { cleanup() })

  return {
    // State
    isCombatActive,
    isMonsterRespawning,
    isRunningAway,
    isRespawning,
    combatLog,
    sortedCombatLog,
    lootLog,
    playerCurrentHealth,
    playerBase,
    monster,
    attackStyles,
    selectedAttackStyle,
    playerWeaponSpeed,
    monsterWeaponSpeed,
    playerHealthPercentage,
    monsterHealthPercentage,
    // Functions
    startCombat,
    handlePlayerAttack,
    handleMonsterAttack,
    rollDamage,
    handleMonsterDeath,
    startMonsterRespawn,
    restartCombat,
    respawn,
    giveLoot,
    logCombat,
    cleanup,
  }
})
