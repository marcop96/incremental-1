<script setup lang='ts'>
import type { Skill } from '~/types'
import resources from '~/data/resources.json'
import levels from '~/data/levels.json'
import { useGatherStore } from '~/composable/useGather'
import { useSkillStore } from '~/composable/useSkills'

const gatherStore = useGatherStore()
const skillStore = useSkillStore()
const { progress, activeResource } = storeToRefs(gatherStore)
const props = defineProps<{ skill: Skill }>()
const filteredResources = computed(() => {
  return resources.filter(resource => resource.skillId === (props.skill as Skill).id)
},
)

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

<template>
  <div>
    Level: {{ skillStore.activeSkill!.level }}  <br>
    Exp: {{ skillStore.activeSkill!.xp }}/ {{ nextLevelExpRequired }} <br>
    Exp to next level: {{ remainingExp }} <br>
    {{ xpPerHour }} xp/h
  </div>
  <progress
    :value="progress"
    max="100"
    class="progress-bar"
  />
  <div
    class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  >
    <ActionCard
      v-for="resource in filteredResources"
      :key="resource.id"
      class="cursor-pointer"
      :resource="resource"
      :active-resource="activeResource"
      @click="gatherStore.toggleGathering(resource)"
    />
  </div>
</template>

<style scoped>
    .progress-bar {
      width: 100%;
      height: 30px;
      border-radius: 15px;
      background-color: #f3f3f3;
      overflow: hidden;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      position: relative;
    }

    .progress-bar::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 0;
      background: red;
      border-radius: 15px 0 0 15px;
      animation: progress-animation infinite forwards;
    }

    @keyframes progress-animation {
      from {
        width: 0;
      }
      to {
        width: var(--progress-value);
      }
    }
</style>
