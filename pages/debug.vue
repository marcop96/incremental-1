<template>
  <div class="max-w-7xl mx-auto p-4">
    <!-- Forms Section -->
    <select v-model="selectedForm"
      class="p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500">
      <option value="item">Item</option>
      <option value="resource">Resource</option>
      <option value="monster">Monster</option>
    </select>

    <div class="flex flex-wrap gap-4">
      <!-- Item Form -->
      <form v-if="selectedForm === 'item'" id="item-form"
        class="w-full md:w-1/2 p-4 mt-12 bg-violet-600 shadow-md rounded-md" @submit.prevent="createItem(item)">
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
      <form v-if="selectedForm === 'resource'" id="resource-form"
        class="w-full md:w-1/2 p-4 mt-12  shadow-md rounded-md" @submit.prevent="createResource(resource)">
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

      <!-- Monster Form -->
      <form v-if="selectedForm === 'monster'" id="monster-form" class="w-full md:w-1/2 p-4 mt-12  shadow-md rounded-md"
        @submit.prevent="createMonster(monster)">
        <p class="text-center text-2xl text-gray-800 mb-4">Monster</p>
        <div class="space-y-4">
          <div>
            <label for="monster-id" class="block text-sm font-medium text-gray-700">ID:</label>
            <input id="monster-id" v-model="monster.id" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-name" class="block text-sm font-medium text-gray-700">Name:</label>
            <input id="monster-name" v-model="monster.name" type="text" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-level" class="block text-sm font-medium text-gray-700">Level:</label>
            <input id="monster-level" v-model="monster.level" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-health" class="block text-sm font-medium text-gray-700">Health:</label>
            <input id="monster-health" v-model="monster.health" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-currentHealth" class="block text-sm font-medium text-gray-700">Current Health:</label>
            <input id="monster-currentHealth" v-model="monster.currentHealth" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-attack" class="block text-sm font-medium text-gray-700">Attack:</label>
            <input id="monster-attack" v-model="monster.attack" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-strength" class="block text-sm font-medium text-gray-700">Strength:</label>
            <input id="monster-strength" v-model="monster.strength" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-defense" class="block text-sm font-medium text-gray-700">Defense:</label>
            <input id="monster-defense" v-model="monster.defense" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-speed" class="block text-sm font-medium text-gray-700">Speed:</label>
            <input id="monster-speed" v-model="monster.speed" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-gold" class="block text-sm font-medium text-gray-700">Gold:</label>
            <input id="monster-gold" v-model="monster.gold" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-xp" class="block text-sm font-medium text-gray-700">XP:</label>
            <input id="monster-xp" v-model="monster.xp" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-drops" class="block text-sm font-medium text-gray-700">
              Drops (comma separated):
            </label>
            <input id="monster-drops" v-model="monster.drops" type="text" placeholder="e.g. drop1,drop2"
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
      <table class="min-w-full  border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th v-for="header in tableHeaders" :key="header.label" class="px-4 py-2 border text-gray-700">
              {{ header.label }}
            </th>
            <th class="px-4 py-2 border text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in displayedRows" :key="row.id" class="hover:bg-green-500">
            <template v-if="editingRow && editingRow.id === row.id">
              <td v-for="header in tableHeaders" :key="header.key" class="px-4 py-2 border">
                <input v-model="editingRow.data[header.key]" class="w-full p-1 border border-gray-300 rounded-md"
                  type="text" />
              </td>
              <td class="px-4 py-2 border">
                <button @click="saveEdit" class="text-green-500 mr-2">
                  Save
                </button>
                <button @click="cancelEdit" class="text-red-500">
                  Cancel
                </button>
              </td>
            </template>
            <template v-else>
              <td v-for="header in tableHeaders" :key="header.key" class="px-4 py-2 border">
                <!-- If the field is an array (like drops), join its values -->
                <span v-if="Array.isArray(row[header.key])">
                  {{
                    row[header.key]
                      .map((item) =>
                        typeof item === 'object' && item.name ? item.name : item
                      )
                      .join(', ')
                  }}
                </span>
                <span v-else>
                  {{ row[header.key] }}
                </span>
              </td>
              <td class="px-4 py-2 border">
                <button @click="editRow(row)" class="text-blue-500">
                  Edit
                </button>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { Item, Resource } from '~/types'
  import type { Monster } from '~/types'
  import resourcesData from '~/data/resources.json'
  import monstersData from '~/data/monsters.json'
  import itemsData from '~/data/items.json'

  // Reactive state for each form
  const item = ref<Item>({
    id: 34,
    name: '4325',
    description: '2345',
    value: 40,
    quantity: 1,
    icon: '2d',
  })

  const resource = ref<Resource>({
    id: 12342134,
    name: 'resource',
    skillId: 1,
    requiredLevel: 3,
    experienceGiven: 23,
    timeToGather: 2,
    itemId: 2004,
  })

  const monster = ref<Monster>({
    id: 7,
    name: 'Vampire',
    health: 50,
    level: 10,
    currentHealth: 50,
    attack: 15,
    strength: 10,
    defense: 8,
    speed: 6,
    gold: 100,
    xp: 200,
    drops: [
      { name: 'Vampire Fang', chance: 100 },
      { name: 'Blood Potion', chance: 20 },
      { name: 'Dark Cloak', chance: 5 },
      { name: '', chance: 75 },
    ],
  })

  // Import data arrays from JSON files
  const resources = ref<Resource[]>(resourcesData)
  const monsters = ref<Monster[]>(monstersData)
  const items = ref<Item[]>(itemsData)

  // Database & Form selectors
  const selectedDatabase = ref<'resources' | 'monsters' | 'items'>('resources')
  const selectedForm = ref<'item' | 'resource' | 'monster'>('item')

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

  // Computed table headers based on selected database
  const tableHeaders = computed(() => {
    if (selectedDatabase.value === 'resources') return resourcesHeaders
    if (selectedDatabase.value === 'monsters') return monstersHeaders
    if (selectedDatabase.value === 'items') return itemsHeaders
    return []
  })

  // Computed displayed rows based on selected database
  const displayedRows = computed(() => {
    if (selectedDatabase.value === 'resources') return resources.value
    if (selectedDatabase.value === 'monsters') return monsters.value
    if (selectedDatabase.value === 'items') return items.value
    return []
  })

  // Inline editing state
  const editingRow = ref<{ id: number; data: any } | null>(null)

  function editRow(row: any) {
    // Make a shallow copy of the row data for editing.
    editingRow.value = { id: row.id, data: { ...row } }
  }

  function cancelEdit() {
    editingRow.value = null
  }

  /**
   */
  function getTemplateForSelectedDatabase() {
    if (selectedDatabase.value === 'monsters') {
      return {
        id: 0,
        name: '',
        health: 0,
        level: 0,
        currentHealth: 0,
        attack: 0,
        strength: 0,
        defense: 0,
        speed: 0,
        gold: 0,
        xp: 0,
        drops: [] as any[],
      }
    } else if (selectedDatabase.value === 'resources') {
      return {
        id: 0,
        name: '',
        skillId: 0,
        requiredLevel: 0,
        experienceGiven: 0,
        timeToGather: 0,
        itemId: 0,
      }
    } else if (selectedDatabase.value === 'items') {
      return {
        id: 0,
        name: '',
        description: '',
        value: 0,
        quantity: 0,
        icon: '',
      }
    }
    return {}
  }

  /**
   * Transforms the edited row data into the proper types based on a template.
   */
  function transformData(data: any, template: any) {
    const newData: any = {}
    for (const key in data) {
      if (template.hasOwnProperty(key)) {
        if (typeof template[key] === 'number') {
          newData[key] = Number(data[key])
        } else if (Array.isArray(template[key])) {
          // For arrays like drops, you might want to add your own parsing logic.
          // For now, we'll assume the field is entered as a comma-separated string
          // and split it into an array of strings.
          newData[key] = typeof data[key] === 'string' ? data[key].split(',').map((s: string) => s.trim()) : data[key]
        } else {
          newData[key] = data[key]
        }
      } else {
        newData[key] = data[key]
      }
    }
    return newData
  }

  async function saveEdit() {
    if (!editingRow.value) return

    let endpoint = ''
    if (selectedDatabase.value === 'items') {
      endpoint = 'api/updateItem'
    } else if (selectedDatabase.value === 'resources') {
      endpoint = 'api/updateResource'
    } else if (selectedDatabase.value === 'monsters') {
      endpoint = 'api/updateMonster'
    }

    // Get the appropriate template and transform the data
    const template = getTemplateForSelectedDatabase()
    const transformedData = transformData(editingRow.value.data, template)

    try {
      const result = await $fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: transformedData,
      })

      if (result.success) {
        // Update the local data array accordingly
        if (selectedDatabase.value === 'items') {
          const index = items.value.findIndex((r) => r.id === editingRow.value!.id)
          if (index !== -1) items.value[index] = transformedData
        } else if (selectedDatabase.value === 'resources') {
          const index = resources.value.findIndex((r) => r.id === editingRow.value!.id)
          if (index !== -1) resources.value[index] = transformedData
        } else if (selectedDatabase.value === 'monsters') {
          const index = monsters.value.findIndex((r) => r.id === editingRow.value!.id)
          if (index !== -1) monsters.value[index] = transformedData
        }
        console.log('Update successful')
        editingRow.value = null
      } else {
        console.error('Update failed:', result.error)
      }
    } catch (error) {
      console.error('Error updating row:', error)
    }
  }

  // Function to handle item form submission
  async function createItem(item: Item) {
    try {
      await $fetch('api/addItem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      }).then((response) => {
        console.log('Item added successfully')
      })
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  // Function to handle monster form submission
  async function createMonster(monster: Monster) {
    try {
      await $fetch('api/addMonster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(monster),
      }).then((response) => {
        console.log('Monster added successfully')
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
        console.log('Resource added successfully')
      })
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }
</script>
