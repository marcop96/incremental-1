<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useInventoryStore } from '../composable/useInventory'
import { useSkillStore } from '~/composable/useSkills'

const inventoryStore = useInventoryStore()
const skillStore = useSkillStore()

const { inventory } = storeToRefs(inventoryStore)
</script>

<template>
  <ul>
    <li
      v-for="skill in skillStore.skills"
      :key="skill.id"
    >
      {{ skill.name }} - {{ skill.level }} - {{ skill.xp }} exp
    </li>
  </ul>

  <h2 class="text-xl font-bold">
    Inventory
  </h2>
  <ul>
    <li
      v-for="item in inventory"
      :key="item.id"
    >
      {{ item.name }} - {{ item.quantity }}
    </li>
  </ul>
</template>
