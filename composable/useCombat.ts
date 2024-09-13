import { defineStore } from 'pinia'

const useCombat = defineStore('combat', () => {
  const combat = ref<Combat>({
    player: {
      name: 'Player',
      health: 100,
      maxHealth: 100,
      attack: 10,
      defense: 5,
    },
    enemy: {
      name: 'Enemy',
      health: 50,
      maxHealth: 50,
      attack: 5,
      defense: 2,
    },
  })

  return { useCombat }
})
