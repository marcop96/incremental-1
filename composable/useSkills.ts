import { defineStore } from 'pinia'
import type { Skill } from '@/types'

const activeSkill = ref<Skill | null>(null)
const activePage = ref<'inventory' | 'shop' | null>(null)
export const useSkillStore = defineStore('skills', () => {
  const skills = ref<Skill[]>([
    { id: 1, name: 'woodcutting', level: 1, xp: 0, isGathering: true },
    { id: 2, name: 'firemaking', level: 1, xp: 0, isGathering: false },
    { id: 3, name: 'fishing', level: 1, xp: 0, isGathering: true },
    { id: 4, name: 'cooking', level: 1, xp: 0, isGathering: false },
  ])

  const changeActiveSkill = (skill: Skill | null) => {
    activeSkill.value = skill
  }
  const changeActivePage = (page: 'inventory' | 'shop' | null) => {
    activePage.value = page
  }
  return { skills, activeSkill, changeActiveSkill, changeActivePage, activePage }
})
