import { defineStore } from 'pinia'
import type { Skill } from '@/types'

const activeSkill = ref<Skill | null>(null)

export const useSkillStore = defineStore('skills', () => {
  const skills = ref<Skill[]>([
    { id: 1, name: 'woodcutting' },
    { id: 2, name: 'firemaking' },
    { id: 3, name: 'fishing' },
    { id: 4, name: 'cooking' },
  ])

  const changeActiveSkill = (skill: Skill | null) => {
    activeSkill.value = skill
  }
  return { skills, activeSkill, changeActiveSkill }
})
