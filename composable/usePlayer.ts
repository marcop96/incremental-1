import { defineStore } from 'pinia'
import { useSkillStore } from '../composable/useSkills'
import levels from '~/data/levels.json'

export const usePlayerStore = defineStore('playerxp', () => {
  const skillStore = useSkillStore()
  const { skills } = storeToRefs(skillStore)
  const addExperience = (skillId: number, exp: number) => {
    const skill = skills.value.find(s => s.id === skillId)
    if (skill) {
      skill.xp += exp
    }

    checkLevelUp(skillId)
  }

  const checkLevelUp = (skillId: number) => {
    const skill = skills.value.find(s => s.id === skillId)
    if (skill) {
      const nextLevel = levels.find(level => level.level === skill.level + 1)
      if (nextLevel && skill.xp >= nextLevel.requiredXP) {
        skill.level++
        console.log(`Player leveled up ${skill.name} to level ${skill.level}`)
      }
    }
  }

  return { addExperience }
})
