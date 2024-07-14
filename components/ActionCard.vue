<script setup lang="ts">
import type { Resource } from '~/types'
import { useSkillStore } from '~/composable/useSkills'

const skillStore = useSkillStore()
const { skills } = storeToRefs(skillStore)

const props = defineProps({
  resource: {
    type: Object as PropType<Resource>,
    required: true,
  },
  activeResource: {
    type: Object as PropType<Resource | object>,
    required: true,
  },
})
const userHasRequiredLevel = computed(() => {
  const skill = skills.value.find(skill => skill.id === props.resource.skillId)

  return skill ? skill.level >= props.resource.requiredLevel : false
})
</script>

<template>
  <div
    class="w-48 h-48 p-2 m-2 bg-white border-2 border-gray-300 rounded-lg shadow-md flex flex-col items-center justify-center transition-colors duration-300 ease-in-out hover:border-gray-700"
    :class="{ hidden: !userHasRequiredLevel }"
  >
    <div class="text-xl font-bold mb-2 text-gray-800">
      {{ resource.name }}
    </div>

    <div class="text-lg font-medium mb-4 text-gray-700">
      {{ resource.experienceGiven }} exp
    </div>
    <div class="w-full h-2 bg-gray-300 rounded-full mb-4">
      <div
        class="h-2 rounded-full transition-colors ease-in-out duration-300"
        :class="{ 'bg-green-500': activeResource && (activeResource as Resource).name === resource.name }"
      />
    </div>
    <div class="text-sm font-medium text-gray-600">
      gather time
      <span
        :class="{
          'text-green-500': activeResource && (activeResource as Resource).name === resource.name,
        }"
      >{{ resource.timeToGather }}</span>
    </div>
  </div>
</template>
