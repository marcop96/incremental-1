import { defineStore } from 'pinia'
import { useSkillStore } from '../composable/useSkills'
import levels from '~/data/levels.json'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()

export const usePlayerStore = defineStore('playerxp', () => {
  const skillStore = useSkillStore()
  const { skills } = storeToRefs(skillStore)

  const addExperience = (skillName: string, exp: number) => {
    const skill = skills.value.find(s => s.name === skillName)
    if (skill) {
      skill.xp += exp
    }
    else { console.log(`${skillName} not found`) }

    checkLevelUp(skillName)
  }

  const checkLevelUp = (skillName: string) => {
    const skill = skills.value.find(s => s.name === skillName)
    if (skill) {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const nextLevel = levels.find(level => level.level === skill.level + 1)
        if (nextLevel && skill.xp >= nextLevel.requiredXP) {
          skill.level++
          toast({
            title: `Congratulations!`,
            description: `your ${skill.name} level is ${skill.level}`,
          })
        }
        else { break }
      }
    }
  }

  return { addExperience }
})
