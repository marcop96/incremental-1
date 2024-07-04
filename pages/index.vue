<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSkillStore } from '../composable/useSkills'
import TheSkills from '../components/TheSkills.vue'
import type { Skill } from '~/types'

const skillStore = useSkillStore()
const { activeSkill } = storeToRefs(skillStore)

const activeSkillName = computed(() => {
  return typeof activeSkill.value === 'object' ? activeSkill.value?.name : ''
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
