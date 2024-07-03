<script setup lang="ts">
  import { useSkillStore } from "../composable/useSkills";
  import { storeToRefs } from 'pinia';
  import TheSkills from '../components/TheSkills.vue';

  const skillStore = useSkillStore();
  const { skills, activeSkill, changeActiveSkill } = storeToRefs(skillStore);
</script>

<template>
  <div class="flex justify-center items-center p-3">
    <h2 v-if="activeSkill !== 'inventory' && activeSkill !== 'skills'" class="text-2xl">{{ activeSkill.name }}</h2>
  </div>

  <!-- <div v-if="activeSkill =='inventory'"></div> -->
  <TheSkills v-if="activeSkill" :skill="activeSkill" />

</template>
