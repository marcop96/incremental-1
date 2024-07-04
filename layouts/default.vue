<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSkillStore } from '../composable/useSkills'

const skillStore = useSkillStore()
const { skills } = storeToRefs(skillStore)
</script>

<template>
  <div class="flex">
    <div class="h-screen w-1/5 bg-green-400 bg-opacity-75 p-4">
      <ul>
        <li class="flex flex-col">
          <button
            class="text-2xl font-bold"
            @click="skillStore.changeActiveSkill('inventory')"
          >
            Inventory
          </button>
          <button
            class="text-2xl font-bold"
          >
            Skills
          </button>
        </li>
        <li
          v-for="skill in skills"
          :key="skill.id"
        >
          <button @click="skillStore.changeActiveSkill(skill)">
            {{ skill.name }}
          </button>
        </li>
      </ul>
    </div>
    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>
