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
    const skill = skills.value.find(skill => skill.name === props.resource.skillName.toLowerCase())
    return skill ? skill.level >= props.resource.requiredLevel : false
  })

  const requiredItem = computed(() => {
    return inventoryStore.findItemInDataBase(undefined, props.resource.itemId)
  })

  const userHasItem = computed(() => {
    return inventoryStore.findItemById(props.resource.itemId) || null
  })

  const userItemCount = computed(() => {
    return (userHasItem.value?.quantity ?? 0)
  })
</script>

<template>
  <div
    class="relative w-48 h-64 m-4 overflow-hidden transition-all duration-300 transform cursor-pointer bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-xl hover:shadow-2xl hover:-translate-y-2"
    :class="{
      'hidden': !userHasRequiredLevel,
      'opacity-50 grayscale pointer-events-none': skillStore.activeSkill?.isGathering === false && !userHasItem,
      'ring-4 ring-green-400/50': gatherStore.activeResource?.name === resource.name
    }">
    <!-- Resource Artwork -->
    <div class="relative z-10 flex items-center justify-center h-32">
      <div class="p-4 transition-transform duration-300 rounded-full bg-gray-900/30 hover:scale-110">
        <!-- <span class="text-4xl" :class="resource.icon">{{ resource.icon }} 🌲</span> -->
      </div>
    </div>

    <!-- Card Content -->
    <div class="relative z-10 p-4 pt-0">
      <div class="mb-2 text-center">
        <h3 class="text-lg font-bold">
          {{ resource.name }}
        </h3>

        <div>
          <div class="text-xs font-medium text-gray-400">
            Lv. {{ resource.requiredLevel }}
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="flex items-center justify-center p-2 rounded-md bg-gray-900/50">
              <span class="mr-1 text-green-400">⏳</span>
              <span class="font-semibold text-gray-300">{{ resource.timeToGather }}s</span>
            </div>
            <div class="flex items-center justify-center p-2 rounded-md bg-gray-900/50">
              <span class="mr-1 text-yellow-400">⭐</span>
              <span class="font-semibold text-gray-300">{{ resource.experienceGiven }}xp</span>
            </div>
          </div>

          <!-- Required Item Display -->
          <div v-if="skillStore.activeSkill?.isGathering === false"
            class="m-2 flex items-center justify-center text-xs text-center bg-black/50">
            <span :class="userItemCount > 0 ? 'text-green-400' : 'text-red-400'">
              ⚠️ Requires {{ requiredItem?.name }} (You have: {{ userItemCount }})
            </span>
          </div>

          <!-- Item Count Display when Gathering is Allowed -->
          <div v-else class="m-2 flex items-center justify-center text-xs text-center bg-black/50">
            <span :class="userItemCount > 0 ? 'text-green-400' : 'text-red-400'">
              You have: {{ userItemCount }}
            </span>
          </div>
        </div>
      </div>

      <!-- Active Progress Bar -->
      <!-- <div v-if="gatherStore.activeResource?.name === resource.name"
        class="absolute bottom-0 left-0 right-0 h-1 bg-green-900/50">
        <div class="h-full bg-gradient-to-r from-green-400 to-emerald-600 transition-all duration-1000 ease-linear"
          :style="{ width: `${gatherStore.progress * 100}%` }" />
      </div>-->
    </div>
  </div>
</template>
