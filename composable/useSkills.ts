import { defineStore } from 'pinia'
import type { Skill } from '@/types'

const activeSkill = ref<Skill | null>(null)

export const useSkillStore = defineStore('skills', () => {
  const skills = ref<Skill[]>([
    { id: 1, name: 'woodcutting', level: 1, xp: 0 },
    { id: 2, name: 'firemaking', level: 1, xp: 0 },
    { id: 3, name: 'fishing', level: 1, xp: 0 },
    { id: 4, name: 'cooking', level: 1, xp: 0 },
  ])

  const changeActiveSkill = (skill: Skill | null) => {
    activeSkill.value = skill
  }
  return { skills, activeSkill, changeActiveSkill }
})
