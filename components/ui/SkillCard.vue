<script setup lang="ts">
import type { Skill } from '~/types'

defineProps<{ skill: Skill }>()
</script>

<template>
  <main class="w-48 h-32 flex flex-col justify-center items-center  bg-red-200 rounded-lg m-4">
    <h1>{{ skill.name }}</h1>
    <p> Level {{ skill.level }} </p>
    <p> {{ skill.xp }} exp</p>
  </main>
</template>
