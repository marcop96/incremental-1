import { defineStore } from 'pinia'
import levels from '~/data/levels.json'

export const usePlayerStore = defineStore('playerxp', () => {
  const player = ref({
    level: 1, xp: 0 })

  const addExperience = (exp: number) => {
    player.value.xp += exp
    checkLevelUp()
  }

  const checkLevelUp = () => {
    const nextLevel = levels.find(level => level.level === player.value.level + 1)

    if (nextLevel && player.value.xp >= nextLevel.requiredXP) {
      player.value.level++
    }

    // check if player has enough xp to level up
    // if they do, level up the player
  }
  return { player, addExperience }
})
