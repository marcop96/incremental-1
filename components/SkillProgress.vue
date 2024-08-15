<template>
  <div>
    Level: {{ skillStore.activeSkill!.level }}  <br>
    Exp: {{ skillStore.activeSkill!.xp }}/ {{ nextLevelExpRequired }} <br>
    Exp to next level: {{ remainingExp }} <br>
    {{ xpPerHour }} xp/h
  </div>
</template>

<script lang="ts" setup>
import type { Skill } from '~/types'
import levels from '~/data/levels.json'
import { useGatherStore } from '~/composable/useGather'
import { useSkillStore } from '~/composable/useSkills'

const gatherStore = useGatherStore()

const { activeResource } = storeToRefs(gatherStore)
const skillStore = useSkillStore()

defineProps<{ skill: Skill }>()

const remainingExp = computed(() => {
  const nextLevel = levels.find(level => level.level === skillStore.activeSkill!.level + 1)
  if (!nextLevel) return ''
  return nextLevel.requiredXP - skillStore.activeSkill!.xp
})
const xpPerHour = computed(() => {
  const gatheringTime = activeResource.value?.timeToGather || 0
  const xpPerResource = activeResource.value?.experienceGiven || 0
  const resourcesPerHour = 3600 / gatheringTime
  const xpPerHour = xpPerResource * resourcesPerHour
  if (!xpPerHour) {
    return 0
  }
  else { return xpPerHour }
})
const nextLevelExpRequired = computed(() => {
  const nextLevel = levels.find(level => level.level === skillStore.activeSkill!.level + 1)
  if (!nextLevel) return ''
  return nextLevel.requiredXP
})
</script>

<style>

</style>
