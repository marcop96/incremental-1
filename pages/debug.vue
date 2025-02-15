<template>
  <div class="max-w-7xl mx-auto p-4">
    <!-- Forms Section -->
    <div class="flex flex-wrap gap-4">
      <!-- Item Form -->
      <form id="item-form" class="w-full md:w-1/2 p-4 mt-12 bg-white shadow-md rounded-md"
        @submit.prevent="submitForm(item)">
        <p class="text-center text-2xl text-gray-800 mb-4">Item</p>
        <div class="space-y-4">
          <div>
            <label for="item-id" class="block text-sm font-medium text-gray-700">ID:</label>
            <input id="item-id" v-model="item.id" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="item-name" class="block text-sm font-medium text-gray-700">Name:</label>
            <input id="item-name" v-model="item.name" type="text" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="item-description" class="block text-sm font-medium text-gray-700">Description:</label>
            <input id="item-description" v-model="item.description" type="text" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="item-value" class="block text-sm font-medium text-gray-700">Value:</label>
            <input id="item-value" v-model="item.value" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="item-icon" class="block text-sm font-medium text-gray-700">Icon:</label>
            <input id="item-icon" v-model="item.icon" type="text" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div class="mt-6 text-center">
          <button type="submit"
            class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Submit
          </button>
        </div>
      </form>

      <!-- Resource Form -->
      <form id="resource-form" class="w-full md:w-1/2 p-4 mt-12 bg-white shadow-md rounded-md"
        @submit.prevent="createResource(resource)">
        <p class="text-center text-2xl text-gray-800 mb-4">Resource</p>
        <div class="space-y-4">
          <div>
            <label for="resource-id" class="block text-sm font-medium text-gray-700">ID:</label>
            <input id="resource-id" v-model="resource.id" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="resource-name" class="block text-sm font-medium text-gray-700">Name:</label>
            <input id="resource-name" v-model="resource.name" type="text" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="resource-skill-id" class="block text-sm font-medium text-gray-700">Skill ID:</label>
            <input id="resource-skill-id" v-model="resource.skillId" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="resource-required-level" class="block text-sm font-medium text-gray-700">Required Level:</label>
            <input id="resource-required-level" v-model="resource.requiredLevel" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="resource-experience-given" class="block text-sm font-medium text-gray-700">Experience
              Given:</label>
            <input id="resource-experience-given" v-model="resource.experienceGiven" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="resource-time-to-gather" class="block text-sm font-medium text-gray-700">Time to Gather:</label>
            <input id="resource-time-to-gather" v-model="resource.timeToGather" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="resource-item-id" class="block text-sm font-medium text-gray-700">Item ID:</label>
            <input id="resource-item-id" v-model="resource.itemId" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div class="mt-6 text-center">
          <button type="submit"
            class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Submit
          </button>
        </div>
      </form>
    </div>

    <!-- Database Selector and Table Display -->
    <div class="mt-12">
      <div class="mb-4">
        <label for="database-select" class="block text-lg font-medium text-gray-700">
          Select Database:
        </label>
        <select id="database-select" v-model="selectedDatabase"
          class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500">
          <option value="resources">Resources</option>
          <option value="monsters">Monsters</option>
          <option value="items">Items</option>
        </select>
      </div>
      <p class="text-center text-2xl mb-4 text-gray-800 capitalize">
        {{ selectedDatabase }} Table
      </p>
      <table class="min-w-full bg-white border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th v-for="header in tableHeaders" :key="header.label" class="px-4 py-2 border text-gray-700">
              {{ header.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in displayedRows" :key="row.id" class="hover:bg-gray-50">
            <td v-for="header in tableHeaders" :key="header.key" class="px-4 py-2 border text-gray-900">
              {{ row[header.key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { Item, Resource } from '~/types'
  import resourcesData from '~/data/resources.json'
  import monstersData from '~/data/monsters.json'
  import itemsData from '~/data/items.json'
  import type { Monster } from '~/types'

  // Define a basic Monster type (adjust as needed)

  const monster: Monster = {
    "id": 7,
    "name": "Vampire",
    "health": 50,
    "level": 10,
    "currentHealth": 50,
    "attack": 15,
    "strength": 10,
    "defense": 8,
    "speed": 6,
    "gold": 100,
    "xp": 200,
    "drops": [
      {
        "name": "Vampire Fang",
        "chance": 100
      },
      {
        "name": "Blood Potion",
        "chance": 20
      },
      {
        "name": "Dark Cloak",
        "chance": 5
      },
      {
        "name": "",
        "chance": 75
      }
    ]
  }
  // State for the item form
  const item = ref<Item>({
    id: 34,
    name: '4325',
    description: '2345',
    value: 40,
    quantity: 1,
    icon: '2d',
  })

  // State for the resource form
  const resource = ref<Resource>({
    id: 12342134,
    name: 'resource',
    skillId: 1,
    requiredLevel: 3,
    experienceGiven: 23,
    timeToGather: 2,
    itemId: 2004,
  })

  // Import data arrays from JSON files
  const resources = ref<Resource[]>(resourcesData)
  const monsters = ref<Monster[]>(monstersData)
  const items = ref<Item[]>(itemsData)

  // Database selector
  const selectedDatabase = ref<'resources' | 'monsters' | 'items'>('resources')

  // Table header definitions for each database
  const resourcesHeaders = [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Skill ID', key: 'skillId' },
    { label: 'Required Level', key: 'requiredLevel' },
    { label: 'Experience Given', key: 'experienceGiven' },
    { label: 'Time to Gather', key: 'timeToGather' },
    { label: 'Item ID', key: 'itemId' },
  ]

  const monstersHeaders = [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Health', key: 'health' },
    { label: 'Attack', key: 'attack' },
    { label: 'Strength', key: 'strength' },
    { label: 'Defense', key: 'defense' },
    { label: 'Speed', key: 'speed' },
    { label: 'Gold', key: 'gold' },
    { label: 'XP', key: 'xp' },
    { label: 'Drops', key: 'drops' },
  ]

  const itemsHeaders = [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Description', key: 'description' },
    { label: 'Value', key: 'value' },
    { label: 'Quantity', key: 'quantity' },
    { label: 'Icon', key: 'icon' },
  ]

  // Computed table headers based on the selected database
  const tableHeaders = computed(() => {
    if (selectedDatabase.value === 'resources') return resourcesHeaders
    if (selectedDatabase.value === 'monsters') return monstersHeaders
    if (selectedDatabase.value === 'items') return itemsHeaders
    return []
  })

  // Computed displayed rows based on the selected database
  const displayedRows = computed(() => {
    if (selectedDatabase.value === 'resources') return resources.value
    if (selectedDatabase.value === 'monsters') return monsters.value
    if (selectedDatabase.value === 'items') return items.value
    return []
  })

  // Function to handle item form submission
  async function submitForm(item: Item) {
    try {
      await $fetch('api/addItem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      }).then((response) => {
        if ((response as Response).ok) {
          console.log('Item added successfully')
        }
      })
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  // Function to handle resource form submission
  async function createResource(resource: Resource) {
    try {
      await $fetch('api/addResource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resource),
      }).then((response) => {
        if ((response as Response).ok) {
          console.log('Resource added successfully')
        }
      })
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }
</script>
