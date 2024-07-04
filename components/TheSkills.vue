<script setup lang='ts'>
import type { Skill } from '~/types'
import resources from '~/data/resources.json'

const props = defineProps<{ skill: Skill | string }>()

const filteredResources = computed(() => {
  if (typeof props.skill === 'string') {
    return []
  }
  return resources.filter(resource => resource.skillId === (props.skill as Skill).id)
})
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
    />
  </div>
</template>
