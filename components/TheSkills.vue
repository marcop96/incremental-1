<script setup lang='ts'>
import type { Skill } from '~/types'
import resources from '~/data/resources.json'
import { useGatherStore } from '~/composable/useGather'
import SkillProgress from '~/components/SkillProgress.vue'

const gatherStore = useGatherStore()
const { progress, activeResource } = storeToRefs(gatherStore)
const props = defineProps<{ skill: Skill }>()
const filteredResources = computed(() => {
  return resources.filter(resource => resource.skillId === (props.skill as Skill).id)
},
)
</script>

<template>
  <div>
    <SkillProgress :skill="skill" />
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
