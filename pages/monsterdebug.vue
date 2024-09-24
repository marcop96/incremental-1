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
              @click="showForm"
            >
              {{ drop.name === '' ? '' : drop.name }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <!-- Floating form modal -->
    <div
      v-if="openForm"
      class="fixed inset-0 bg-gray-800  flex justify-center items-center"
    >
      <div class="bg-white p-8 rounded shadow-lg w-96">
        <h2 class="text-lg font-bold mb-4">
          Add Item to Database
        </h2>
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label class="block text-sm font-bold mb-2">Name</label>
            <input
              v-model="form.name"
              type="text"
              class="border border-gray-300 p-2 w-full"
              required
            >
          </div>

          <div class="mb-4">
            <label class="block text-sm font-bold mb-2">Description</label>
            <input
              v-model="form.description"
              type="text"
              class="border border-gray-300 p-2 w-full"
              required
            >
          </div>

          <div class="mb-4">
            <label class="block text-sm font-bold mb-2">Value</label>
            <input
              v-model="form.value"
              type="number"
              class="border border-gray-300 p-2 w-full"
              required
            >
          </div>

          <div class="mb-4">
            <label class="block text-sm font-bold mb-2">Quantity</label>
            <input
              v-model="form.quantity"
              type="number"
              class="border border-gray-300 p-2 w-full"
              required
            >
          </div>

          <div class="mb-4">
            <label class="block text-sm font-bold mb-2">Icon</label>
            <input
              v-model="form.icon"
              type="text"
              class="border border-gray-300 p-2 w-full"
              required
            >
          </div>

          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Item
          </button>
          <button
            type="button"
            class="ml-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            @click="closeForm"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import monsters from '~/data/monsters.json'
import { useInventoryStore } from '~/composable/useInventory'
import type { ItemWithoutID } from '~/types'

const openForm = ref(false)
const form = ref({
  name: '',
  description: '',
  value: 0,
  quantity: 1,
  icon: '',
})
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

function showForm() {
  openForm.value = true
}
function closeForm() {
  openForm.value = false
  resetForm()
}

function resetForm() {
  form.value = {
    name: '',
    description: '',
    value: 0,
    quantity: 1,
    icon: '',
  }
}

function submitForm() {
  // Logic to add the item to the database
  const newItem: ItemWithoutID = {
    name: form.value.name,
    description: form.value.description,
    value: form.value.value,
    quantity: form.value.quantity,
    icon: form.value.icon,
  }

  inventoryStore.addItemToDataBase(newItem) // Save the item to the database
  closeForm()
  console.log(`Item ${newItem.name} added to the database.`)
}
</script>

<style scoped>
/* Optional: Adjust floating modal styling */
</style>
