<script setup lang="ts">
  import { useSkillStore } from "../composable/useSkills";
  import { storeToRefs } from 'pinia';

  const skillStore = useSkillStore();
  const { skills, activeSkill, changeActiveSkill } = storeToRefs(skillStore);
</script>

<template>
  <div class="flex">
    <div class="h-screen w-1/5 bg-green-400 bg-opacity-75 p-4">
      <ul>
        <li class='flex flex-col'>
        <button @click="skillStore.changeActiveSkill('inventory')" class="text-2xl font-bold">Inventory</button>
        <button @click="skillStore.changeActiveSkill('skills')" class="text-2xl font-bold">Skills</button>
        </li>
        <li v-if="activeSkill !== 'inventory'" v-for="skill in skills" :key="skill.id">
          <button @click="skillStore.changeActiveSkill(skill)">{{ skill.name }}</button>
        </li>
      </ul>
    </div>
    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>
