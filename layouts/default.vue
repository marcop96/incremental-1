<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useSkillStore } from '../composable/useSkills'
  import { useGatherStore } from '../composable/useGather'

  const gatherStore = useGatherStore()
  const skillStore = useSkillStore()
  const { skills } = storeToRefs(skillStore)

  const combatSkills = computed(() => skills.value.filter(skill => skill.isCombat))
  const nonCombatSkills = computed(() => skills.value.filter(skill => !skill.isCombat))
</script>

<template>
  <div class="flex h-screen bg-gray-900 text-white">
    <!-- Sidebar -->
    <aside class="w-72 bg-gray-800 shadow-xl flex flex-col">
      <!-- Header -->
      <header class="p-6 border-b border-gray-700">
        <h1 class="text-2xl font-bold tracking-wide">Game Menu</h1>
      </header>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-6 overflow-y-auto">
        <!-- Inventory -->
        <button
          class="w-full flex items-center px-4 py-3 bg-gray-700 rounded hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
          @click="skillStore.changeActiveSkill(null)">
          <!-- Inventory Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18" />
          </svg>
          <span>Inventory</span>
        </button>

        <!-- Combat Skills -->
        <div>
          <h2 class="px-4 py-2 text-lg font-semibold border-b border-gray-700">
            Combat Skills
          </h2>
          <div class="mt-3 space-y-2">
            <button v-for="skill in combatSkills" :key="skill.id"
              class="w-full flex justify-between items-center px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
              @click="skillStore.changeActiveSkill(skill), gatherStore.stopGathering()">
              <span>{{ skill.name }}</span>
              <span class="text-sm text-gray-300">({{ skill.level }}/99)</span>
            </button>
          </div>
        </div>

        <!-- Non-Combat Skills -->
        <div>
          <h2 class="px-4 py-2 text-lg font-semibold border-b border-gray-700">
            Skills
          </h2>
          <div class="mt-3 space-y-2">
            <button v-for="skill in nonCombatSkills" :key="skill.id"
              class="w-full flex justify-between items-center px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
              @click="skillStore.changeActiveSkill(skill), gatherStore.stopGathering()">
              <span>{{ skill.name }}</span>
              <span class="text-sm text-gray-300">({{ skill.level }}/99)</span>
            </button>
          </div>
        </div>
      </nav>

      <!-- Footer -->
      <footer class="p-4 border-t border-gray-700">
        <p class="text-xs text-gray-500 text-center">Version 1.0.0</p>
      </footer>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 overflow-auto">
      <NuxtPage />
    </main>
  </div>
</template>
