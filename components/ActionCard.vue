<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, defineProps } from 'vue'
import { storeToRefs } from 'pinia'
import type { Resource } from '~/types'
import { useSkillStore } from '~/composable/useSkills'
import { useInventoryStore } from '~/composable/useInventory'
import { useGatherStore } from '~/composable/useGather'

const skillStore = useSkillStore()
const inventoryStore = useInventoryStore()
const gatherStore = useGatherStore()
const { skills } = storeToRefs(skillStore)

const props = defineProps({
  resource: {
    type: Object as PropType<Resource>,
    required: true,
  },

})

const userHasRequiredLevel = computed(() => {
  const skill = skills.value.find(skill => skill.id === props.resource.skillId)
  return skill ? skill.level >= props.resource.requiredLevel : false
})

const userHasItem = computed(() => {
  if (skillStore.activeSkill?.isGathering === false) {
    return !!inventoryStore.findItemById(props.resource.itemId)
  }
  return false
})
</script>

<template>
  <div
    class="w-48 h-48 p-2 m-2  border-2 border-gray-300 rounded-lg shadow-md flex flex-col items-center justify-center transition-colors duration-300 ease-in-out  hover:border-gray-700"
    :class="{
      'hidden': !userHasRequiredLevel,
      'bg-gray-300 cursor-not-allowed': skillStore.activeSkill?.isGathering===false && !userHasItem, // Adding a conditional class for `userHasItem`
    }"
  >
    <div class="text-xl font-bold mb-2 text-gray-800">
      {{ props.resource.name }}
    </div>

    <div
      class="text-lg font-medium mb-4 text-gray-700"
      :class="{ 'text-green-500 ': gatherStore.activeResource && (gatherStore.activeResource as Resource).name === props.resource.name }"
    >
      {{ props.resource.experienceGiven }} exp
    </div>
    <div class="w-full h-2 bg-gray-300 rounded-full mb-4">
      <div
        class="h-2 rounded-full transition-colors ease-in-out duration-300"
        :class="{ 'bg-green-500 ': gatherStore.activeResource && (gatherStore.activeResource as Resource).name === props.resource.name }"
      />
    </div>
    <div class="text-sm font-medium text-gray-600">
      Gather Time:
      <span
        :class="{
          'text-green-500': gatherStore.activeResource && (gatherStore.activeResource as Resource).name === props.resource.name,
        }"
      >{{ props.resource.timeToGather }}</span>
    </div>
  </div>
</template>
