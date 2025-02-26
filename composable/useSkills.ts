import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Skill } from '@/types'

export const useSkillStore = defineStore('skills', () => {
  const skills = ref<Skill[]>([
    { id: 1, name: 'woodcutting', level: 1, xp: 0, isGathering: true },
    { id: 2, name: 'firemaking', level: 1, xp: 0, isGathering: false },
    { id: 3, name: 'fishing', level: 1, xp: 0, isGathering: true },
    { id: 4, name: 'cooking', level: 1, xp: 0, isGathering: false },
    { id: 5, name: 'mining', level: 1, xp: 0, isGathering: true },
    { id: 6, name: 'attack', level: 1, xp: 0, isGathering: false, isCombat: true },
    { id: 7, name: 'strength', level: 1, xp: 0, isGathering: false, isCombat: true },
    { id: 8, name: 'defense', level: 1, xp: 0, isGathering: false, isCombat: true },
    { id: 9, name: 'hitpoints', level: 10, xp: 1000, isGathering: false, isCombat: true },
  ])

  const activeSkill = ref<Skill | null>(null)

  // Find the hitpoints skill and calculate max health (hitpoints level * 10)
  const hitpointsSkill = computed(() => skills.value.find(skill => skill.name === 'hitpoints'))
  const playerMaxHealth = computed(() => hitpointsSkill.value ? hitpointsSkill.value.level * 10 : 10)

  // Initialize current health to max health.
  const playerCurrentHealth = ref(playerMaxHealth.value)

  const changeActiveSkill = (skill: Skill | null) => {
    activeSkill.value = skill
  }

  return { skills, activeSkill, changeActiveSkill, playerCurrentHealth, playerMaxHealth }
})
