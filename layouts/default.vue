<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSkillStore } from '../composable/useSkills'
import { useGatherStore } from '../composable/useGather'

const gatherStore = useGatherStore()
const skillStore = useSkillStore()
const { skills } = storeToRefs(skillStore)

const combatSkills = computed(() => skills.value.filter(skill => skill.isCombat === true))
const nonCombatSkills = computed(() => skills.value.filter(skill => !skill.isCombat))
</script>

<template>
  <div class="flex h-screen">
    <div class="w-64 bg-green-500 text-white shadow-lg">
      <div class="p-4">
        <h2 class="text-2xl text-center font-bold mb-4">
          Menu
        </h2>
        <ul class="space-y-2">
          <li>
            <button
              class="w-full text-left py-2 px-4 rounded hover:bg-green-600 transition duration-200"
              @click="skillStore.changeActiveSkill(null)"
            >
              Inventory
            </button>
          </li>
          <li>
            <h2 class="text-xl text-center font-bold mb-4">
              Combat Skills
            </h2>
          </li>
          <li class="border-t border-green-400 my-2" />
          <li
            v-for="skill in combatSkills"
            :key="skill.id"
          >
            <button
              class="w-full text-center py-2 px-4 rounded hover:bg-green-600 transition duration-200"
              @click="skillStore.changeActiveSkill(skill), gatherStore.stopGathering()"
            >
              {{ skill.name }} ({{ skill.level }}/99)
            </button>
          </li>
          <li>
            <h2 class="text-xl text-center font-bold mb-4">
              Skills
            </h2>
          </li>
          <li class="border-t border-green-400 my-2" />
          <li
            v-for="skill in nonCombatSkills"
            :key="skill.id"
          >
            <button
              class="w-full text-center py-2 px-4 rounded hover:bg-green-600 transition duration-200"
              @click="skillStore.changeActiveSkill(skill), gatherStore.stopGathering()"
            >
              {{ skill.name }} ({{ skill.level }}/99)
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div class="flex-1 overflow-auto">
      <NuxtPage />
    </div>
  </div>
</template>
