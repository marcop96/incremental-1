<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSkillStore } from '../composable/useSkills'
import TheSkills from '../components/TheSkills.vue'
import { Progress } from '@/components/ui/progress'
import type { Skill } from '~/types'

const skillStore = useSkillStore()
const { activeSkill } = storeToRefs(skillStore)

const activeSkillName = computed(() => {
  return typeof activeSkill.value === 'object' ? activeSkill.value?.name : ''
})
</script>

<template>
  <div v-if="activeSkill">
    <Progress />
    <div class="flex justify-center items-center p-3">
      <h2
        v-if="activeSkillName"
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
    </div>

    <!-- <div v-if="activeSkill =='inventory'"></div> -->
    <TheSkills
      v-if="activeSkill"
      :skill="activeSkill as Skill"
    />
  </div>

  <div v-else>
    <h2 class="text-2xl">
      Inventory
    </h2>
  </div>
</template>
