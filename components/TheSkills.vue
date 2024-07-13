<script setup lang='ts'>
import type { Skill, Resource } from '~/types'
import resources from '~/data/resources.json'
import { useGatherStore } from '~/composable/useGather'

const gatherResourceStore = useGatherStore()

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
  <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
