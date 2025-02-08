<script setup lang="ts">
  import type { Skill } from '~/types'

  const props = defineProps<{ skill: Skill }>()


</script>

<template>
  <div
    class="w-64 h-40 p-4 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl shadow-lg m-4 flex flex-col justify-between">
    <!-- Skill Name -->
    <div>
      <h2 class="text-white text-2xl font-bold">
        {{ skill.name }}
      </h2>
    </div>

    <!-- Skill Details -->
    <div class="flex justify-between items-center">
      <span class="text-white text-lg">
        Level {{ skill.level }} / 99
      </span>
      <span class="text-white text-lg">
        {{ skill.xp }} XP
      </span>

    </div>
  </div>
</template>
