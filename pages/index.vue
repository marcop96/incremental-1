<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSkillStore } from '../composable/useSkills'
import { useInventoryStore } from '../composable/useInventory'
import TheSkills from '../components/TheSkills.vue'
import type { Skill } from '~/types'

const skillStore = useSkillStore()
const inventoryStore = useInventoryStore()
const { activeSkill } = storeToRefs(skillStore)

const activeSkillName = computed(() => {
  return typeof activeSkill.value === 'object' ? activeSkill.value?.name : ''
})

let intervalId

onMounted(() => {
  if (localStorage.getItem('activeSkill')) {
    skillStore.activeSkill = (JSON.parse(localStorage.getItem('activeSkill')))
  }
  if (localStorage.getItem('playerInventory')) {
    inventoryStore.inventory = (JSON.parse(localStorage.getItem('playerInventory')))
  }
  if (localStorage.getItem('playerSkills')) {
    skillStore.skills = (JSON.parse(localStorage.getItem('playerSkills')))
  }

  intervalId = setInterval(() => {
    localStorage.setItem('activeSkill', JSON.stringify(activeSkill.value))
    localStorage.setItem('playerInventory', JSON.stringify(inventoryStore.inventory))
    localStorage.setItem('playerSkills', JSON.stringify(skillStore.skills))
  }, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <div
    v-if="activeSkill"
    class="flex justify-center flex-col items-center p-3"
  >
    <h2
      class="text-2xl"
    >
      {{ activeSkillName }}
    </h2>
    <h2
      v-if="!activeSkillName"
      class="text-2xl"
    >
      {{ activeSkill }}
    </h2>

    <TheSkills
      v-if="activeSkill"
      :skill="activeSkill as Skill"
    />
  </div>
  <div v-else>
    <TheInventory v-if="!activeSkill" />
  </div>
</template>
