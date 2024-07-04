<script setup lang='ts'>
import type { Skill, Resource, Item } from '~/types'
import resources from '~/data/resources.json'
import { useGatherStore } from '~/composable/useGather'

const gatherResourceStore = useGatherStore()

const props = defineProps<{ skill: Skill }>()
const rewardItem = ref<Item>({ id: 1, name: 'Sword', description: 'A sharp blade used for combat.', value: 50, quantity: 1 })
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
  <div class="grid grid-cols-4">
    <ActionCard
      v-for="resource in filteredResources"
      :key="resource.id"
      class="cursor-pointer"
      :resource="resource"
      :active-resource="activeResource"
      @click="gatherResourceStore.gatherResource(resource, rewardItem)"
    />
  </div>
</template>
