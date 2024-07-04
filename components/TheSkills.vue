<script setup lang='ts'>
import type { Skill, Resource } from '~/types'
import resources from '~/data/resources.json'

const props = defineProps<{ skill: Skill }>()
const activeResource = ref<Resource | undefined>(undefined)
const filteredResources = computed(() => {
  return resources.filter(resource => resource.skillId === (props.skill as Skill).id)
},
)
</script>

<template>
  <!-- <h2 v-if="skill !=='inventory'">
    {{ skill }}
  </h2> -->
  <div class="grid grid-cols-4">
    <ActionCard
      v-for="resource in filteredResources"
      :key="resource.id"
      :resource="resource"
      :active-resource="activeResource"
      @click="activeResource = resource"
    />
  </div>
</template>
