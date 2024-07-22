<script setup lang="ts">
import type { Item } from '~/types'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

defineProps<{
  item: Item
}>()
</script>

<template>
  <HoverCard>
    <HoverCardTrigger as-child>
      <div class="relative flex justify-center items-center w-32 h-32 bg-red-200 rounded-lg shadow-lg">
        <Icon
          :name="item.icon"
          color="black"
          class="w-3/4 h-3/4"
        />
        <div class="absolute bottom-0 right-0 bg-red-500 text-white text-sm font-bold p-1 rounded-full shadow">
          {{ item.quantity }}
        </div>
        <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs font-semibold p-1 rounded-t-lg shadow mt-1 max-w-full w-fit  ">
          <p class=" truncate text-xs">
            {{ item.name }}
          </p>
        </div>
      </div>
      <HoverCardContent>
        <p>{{ item.name }}</p>
        <p>{{ item.description }}</p>
      </HoverCardContent>
    </HoverCardTrigger>
  </HoverCard>
</template>
