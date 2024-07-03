<script setup lang="ts">
  import { useSkillStore } from "../composable/useSkills";
  import { storeToRefs } from 'pinia';

  const skillStore = useSkillStore();
  const { skills, activeSkill, changeActiveSkill } = storeToRefs(skillStore);
</script>

<template>
  <div class="flex">
    <div class="h-screen w-1/5 bg-green-400 bg-opacity-75 p-4">
      <h2 class="text-2xl font-bold">Inventory</h2>
      <h2 class="text-2xl font-bold">Skills</h2>
      <ul>
        <li v-for="skill in skills" :key="skill.id">
          <button @click="skillStore.changeActiveSkill(skill.name)">{{ skill.name }}</button>
        </li>
      </ul>
    </div>
    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>
