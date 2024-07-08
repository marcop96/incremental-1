<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSkillStore } from '../composable/useSkills'
import { useGatherStore } from '../composable/useGather'
import items from '~/data/items.json'
import resources from '~/data/resources.json'

const skillStore = useSkillStore()
const gatherStore = useGatherStore()
const { gatherResource } = storeToRefs(gatherStore)
const { skills } = storeToRefs(skillStore)
</script>

<template>
  <div class="flex">
    <div class="h-screen w-1/5 bg-green-400 bg-opacity-75 p-4">
      <button @click="gatherStore.gatherResource(resources[0], items[0])">
        test mode
      </button>
      <ul>
        <li class="flex flex-col">
          <button
            class="text-2xl font-bold"
            @click="skillStore.changeActiveSkill(null)"
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
