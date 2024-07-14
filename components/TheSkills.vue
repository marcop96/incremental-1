<script setup lang='ts'>
import type { Skill, Resource } from '~/types'
import resources from '~/data/resources.json'
import { useGatherStore } from '~/composable/useGather'

const gatherResourceStore = useGatherStore()
const { progress } = storeToRefs(gatherResourceStore)
const props = defineProps<{ skill: Skill }>()
const activeResource = ref<Resource | object>({})
const filteredResources = computed(() => {
  return resources.filter(resource => resource.skillId === (props.skill as Skill).id)
},
)
</script>

<template>
  <!-- <h2 v-if="skill !=='inventory'">
    {{ skill }}
  </h2> -->
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
      @click="gatherResourceStore.gatherResource(resource)"
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
