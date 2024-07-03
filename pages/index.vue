<script setup lang="ts">
  import { useSkillStore } from "../composable/useSkills";
  import { storeToRefs } from 'pinia';

  const skillStore = useSkillStore();
  const { skills, activeSkill, changeActiveSkill } = storeToRefs(skillStore);
</script>

<template>
  <div class="flex justify-center items-center p-3">
    <h2 v-if="activeSkill !== 'inventory' && activeSkill !== 'skills'" class="text-2xl">{{ activeSkill }}</h2>
  </div>
</template>
