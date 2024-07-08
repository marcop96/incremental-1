<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useInventoryStore } from '../composable/useInventory'
import { usePlayerStore } from '~/composable/usePlayer'

const inventoryStore = useInventoryStore()
const playerStore = usePlayerStore()

const { inventory } = storeToRefs(inventoryStore)
setTimeout(() => {
  console.log('inventory', inventory.value)
}, 3000)
</script>

<template>
  <span>
    Level    {{ playerStore.player.level }} <br>
    {{ playerStore.player.xp }} Exp
  </span>
  <ul>
    <li
      v-for="item in inventory"
      :key="item.id"
    >
      {{ item.name }} - {{ item.quantity }}
    </li>
  </ul>
</template>
