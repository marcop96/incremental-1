<script setup lang='ts'>
import type { Skill } from '~/types'

const props = defineProps<{ skill: Skill | string }>()

console.log(props.skill)
</script>

<template>
  <h2>{{ skill }}</h2>
</template>
