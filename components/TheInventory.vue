<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useInventoryStore } from '../composable/useInventory'

const inventoryStore = useInventoryStore()

const { inventory } = storeToRefs(inventoryStore)
setTimeout(() => {
  console.log('inventory', inventory.value)
}, 3000)
</script>

<template>
  <ul>
    <li
      v-for="item in inventory"
      :key="item.id"
    >
      {{ item }}
    </li>
  </ul>
</template>
