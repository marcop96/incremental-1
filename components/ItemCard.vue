<script setup lang="ts">
  import type { Item } from '~/types'
  import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from '@/components/ui/hover-card'

  defineProps<{ item: Item }>()
</script>

<template>
  <HoverCard>
    <!-- Trigger for the hover card -->
    <HoverCardTrigger as-child>
      <div
        class="relative flex flex-col justify-center items-center w-32 h-32 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer">
        <!-- Inline SVG placeholder for the icon -->
        <div class="flex items-center justify-center w-16 h-16">
          <svg class="w-full h-full fill-current text-black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 3.78 3.4 7.24 8 11.54 4.6-4.3 8-7.76 8-11.54 0-3.87-3.13-7-7-7z" />
          </svg>
        </div>

        <!-- Quantity Badge -->
        <div class="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
          {{ item.quantity }}
        </div>

        <!-- Name Overlay -->
        <div
          class="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 w-full text-center py-1 rounded-b-xl">
          <span class="text-white text-sm font-medium truncate">
            {{ item.name }}
          </span>
        </div>
      </div>
    </HoverCardTrigger>

    <!-- Hover card content -->
    <HoverCardContent class="p-4 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200">
      <h3 class="text-lg font-semibold mb-2">{{ item.name }}</h3>
      <p class="text-sm">{{ item.description }}</p>
    </HoverCardContent>
  </HoverCard>
</template>
