<template>
  <div>
    <h1>Monster Drop Debug</h1>
    <table class="table-auto border-collapse border border-black w-full">
      <thead>
        <tr class="bg-gray-200">
          <th class="border border-black p-2">
            Monster
          </th>
          <th class="border border-black p-2">
            Drop
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through each monster -->
        <template
          v-for="(monster, index) in monsterDrops"
          :key="index"
        >
          <!-- Loop through each drop for the monster -->
          <tr
            v-for="(drop, dropIndex) in monster.drops"
            :key="dropIndex"
          >
            <!-- Render monster name only for the first drop (using rowspan) -->
            <td
              v-if="dropIndex === 0"
              class="border border-black p-2 align-top"
              :rowspan="monster.drops.length"
            >
              {{ monster.name }}
            </td>
            <td
              class="border border-black p-2"
              :class="{ 'bg-red-200': !drop.inDatabase }"
            >
              {{ drop.name === '' ? '(empty drop)' : drop.name }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import monsters from '~/data/monsters.json'
import { useInventoryStore } from '~/composable/useInventory'

const inventoryStore = useInventoryStore()
const monsterDrops = ref([])

// Process each monster and check their drops in the database
for (const monster of monsters) {
  const monsterWithDrops = {
    name: monster.name,
    drops: monster.drops.map(drop => ({
      name: drop.name,
      inDatabase: inventoryStore.findItemInDataBase(drop.name) !== null, // Check if item is in the database
    })),
  }
  monsterDrops.value.push(monsterWithDrops)
}
</script>
