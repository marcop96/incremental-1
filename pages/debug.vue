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
      <!-- Item Form (ID is auto-assigned) -->
      <form v-if="selectedForm === 'item'" id="item-form"
        class="w-full md:w-1/2 p-4 mt-12 bg-violet-600 shadow-md rounded-md" @submit.prevent="createItem">
        <p class="text-center text-2xl text-gray-800 mb-4">Item</p>
        <div class="space-y-4">
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
            <input id="item-value" v-model.number="item.value" type="number" required
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

      <!-- Resource Form (ID is auto-assigned) -->
      <form v-if="selectedForm === 'resource'" id="resource-form" class="w-full md:w-1/2 p-4 mt-12 shadow-md rounded-md"
        @submit.prevent="createResource">
        <p class="text-center text-2xl text-gray-800 mb-4">Resource</p>
        <!-- No ID field -->
        <div class="space-y-4">
          <div>
            <label for="resource-name" class="block text-sm font-medium text-gray-700">Name:</label>
            <input id="resource-name" v-model="resource.name" type="text" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="resource-skill-id" class="block text-sm font-medium text-gray-700">Skill ID:</label>
            <input id="resource-skill-id" v-model.number="resource.skillId" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="resource-required-level" class="block text-sm font-medium text-gray-700">Required Level:</label>
            <input id="resource-required-level" v-model.number="resource.requiredLevel" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="resource-experience-given" class="block text-sm font-medium text-gray-700">Experience
              Given:</label>
            <input id="resource-experience-given" v-model.number="resource.experienceGiven" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="resource-time-to-gather" class="block text-sm font-medium text-gray-700">Time to Gather:</label>
            <input id="resource-time-to-gather" v-model.number="resource.timeToGather" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="resource-item-id" class="block text-sm font-medium text-gray-700">Item ID:</label>
            <input id="resource-item-id" v-model.number="resource.itemId" type="number" required
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

      <!-- Monster Form (ID is auto-assigned) -->
      <form v-if="selectedForm === 'monster'" id="monster-form" class="w-full md:w-1/2 p-4 mt-12 shadow-md rounded-md"
        @submit.prevent="createMonster">
        <p class="text-center text-2xl text-gray-800 mb-4">Monster</p>
        <!-- No ID field -->
        <div class="space-y-4">
          <div>
            <label for="monster-name" class="block text-sm font-medium text-gray-700">Name:</label>
            <input id="monster-name" v-model="monster.name" type="text" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-level" class="block text-sm font-medium text-gray-700">Level:</label>
            <input id="monster-level" v-model.number="monster.level" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-health" class="block text-sm font-medium text-gray-700">Health:</label>
            <input id="monster-health" v-model.number="monster.health" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-currentHealth" class="block text-sm font-medium text-gray-700">Current Health:</label>
            <input id="monster-currentHealth" v-model.number="monster.currentHealth" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-attack" class="block text-sm font-medium text-gray-700">Attack:</label>
            <input id="monster-attack" v-model.number="monster.attack" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-strength" class="block text-sm font-medium text-gray-700">Strength:</label>
            <input id="monster-strength" v-model.number="monster.strength" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-defense" class="block text-sm font-medium text-gray-700">Defense:</label>
            <input id="monster-defense" v-model.number="monster.defense" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-speed" class="block text-sm font-medium text-gray-700">Speed:</label>
            <input id="monster-speed" v-model.number="monster.speed" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-gold" class="block text-sm font-medium text-gray-700">Gold:</label>
            <input id="monster-gold" v-model.number="monster.gold" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-xp" class="block text-sm font-medium text-gray-700">XP:</label>
            <input id="monster-xp" v-model.number="monster.xp" type="number" required
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="monster-drops" class="block text-sm font-medium text-gray-700">
              Drops (comma separated, format: name:chance):
            </label>
            <input id="monster-drops" v-model="monster.dropsInput" type="text"
              placeholder="e.g. Vampire Fang:100,Blood Potion:20"
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
      <table class="min-w-full border border-gray-300">
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
                <!-- Do not allow editing of ID -->
                <template v-if="header.key === 'id'">
                  <span>{{ editingRow.data[header.key] }}</span>
                </template>
                <template v-else>
                  <input v-if="isNumberField(header.key)" v-model.number="editingRow.data[header.key]" type="number"
                    class="w-full p-1 border border-gray-300 rounded-md bg-inherit" />
                  <input v-else v-model="editingRow.data[header.key]" type="text"
                    class="w-full p-1 border border-gray-300 rounded-md bg-inherit" />
                </template>
              </td>
              <td class="px-4 py-2 border">
                <button @click="saveEdit" class="text-green-500 mr-2">Save</button>
                <button @click="cancelEdit" class="text-red-500">Cancel</button>
              </td>
            </template>
            <template v-else>
              <td v-for="header in tableHeaders" :key="header.key" class="px-4 py-2 border">
                <span v-if="Array.isArray(row[header.key])">
                  {{
                    row[header.key]
                      .map((item) =>
                        typeof item === 'object'
                          ? `${item.name} (Chance: ${item.chance})`
                          : item
                      )
                      .join(', ')
                  }}
                </span>
                <span v-else>
                  {{ row[header.key] }}
                </span>
              </td>
              <td class="px-4 py-2 border">
                <button @click="editRow(row)" class="text-blue-500">Edit</button>
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
  import type { Item, Resource, Monster } from '~/types'
  import resourcesData from '~/data/resources.json'
  import monstersData from '~/data/monsters.json'
  import itemsData from '~/data/items.json'

  // Reactive state for each form (ID is omitted for creation)
  const item = ref<Omit<Item, 'id'>>({
    name: '4325',
    description: '2345',
    value: 40,
    quantity: 1,
    icon: '2d',
  })

  const resource = ref<Omit<Resource, 'id'>>({
    name: 'resource',
    skillId: 1,
    requiredLevel: 3,
    experienceGiven: 23,
    timeToGather: 2,
    itemId: 2004,
  })

  /**
   * For monsters, we also want to allow a comma‐separated input for drops,
   * so we use a temporary field `dropsInput` for creation.
   */
  const monster = ref<Omit<Monster, 'id' | 'drops'> & { dropsInput: string }>({
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
    dropsInput: 'Vampire Fang:100,Blood Potion:20,Dark Cloak:5',
  })

  // Data arrays imported from JSON files
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
   * Returns a template with correct types for the selected database.
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
   * Helper: returns true if the given key (field) is expected to be a number.
   */
  function isNumberField(key: string): boolean {
    const template = getTemplateForSelectedDatabase()
    return typeof template[key] === 'number'
  }

  /**
   * Validates and transforms data based on a template.
   * If a field expected to be a number is invalid, it alerts and returns null.
   */
  function transformData(data: any, template: any) {
    const newData: any = {}
    for (const key in data) {
      if (template.hasOwnProperty(key)) {
        if (typeof template[key] === 'number') {
          const num = Number(data[key])
          if (isNaN(num)) {
            alert(`Invalid number for field ${key}`)
            return null
          }
          newData[key] = num
        } else if (Array.isArray(template[key])) {
          newData[key] =
            typeof data[key] === 'string'
              ? data[key].split(',').map((s: string) => s.trim())
              : data[key]
        } else {
          newData[key] = data[key]
        }
      } else {
        newData[key] = data[key]
      }
    }
    return newData
  }

  /**
   * Helper to compute the next ID given an array of objects with an 'id' field.
   */
  function getNextId(arr: Array<{ id: number }>): number {
    return arr.length === 0 ? 1 : Math.max(...arr.map((x) => x.id)) + 1
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

    const template = getTemplateForSelectedDatabase()
    const transformedData = transformData(editingRow.value.data, template)

    if (!transformedData) {
      // Validation failed.
      return
    }

    try {
      const result = await $fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: transformedData,
      })

      if (result.success) {
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

  // Form submission functions for adding new records

  async function createItem() {
    // Automatically assign next ID
    const newId = getNextId(items.value)
    const newItem: Item = { id: newId, ...item.value }
    try {
      await $fetch('api/addItem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: newItem,
      })
      items.value.push(newItem)
      console.log('Item added successfully')
      item.value = { name: '', description: '', value: 0, quantity: 0, icon: '' }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  async function createResource() {
    const newId = getNextId(resources.value)
    const newResource: Resource = { id: newId, ...resource.value }
    try {
      await $fetch('api/addResource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: newResource,
      })
      resources.value.push(newResource)
      console.log('Resource added successfully')
      resource.value = { name: '', skillId: 0, requiredLevel: 0, experienceGiven: 0, timeToGather: 0, itemId: 0 }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  async function createMonster() {
    const newId = getNextId(monsters.value)
    // Process drops: assume dropsInput is in the format "name:chance,name:chance"
    let drops: any[] = []
    if (monster.value.dropsInput) {
      drops = monster.value.dropsInput.split(',').map((s: string) => {
        const parts = s.split(':')
        return { name: parts[0].trim(), chance: Number(parts[1]) }
      })
    }
    const newMonster: Monster = { id: newId, ...monster.value, drops }
    delete (newMonster as any).dropsInput
    try {
      await $fetch('api/addMonster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: newMonster,
      })
      monsters.value.push(newMonster)
      console.log('Monster added successfully')
      monster.value = { name: '', health: 0, level: 0, currentHealth: 0, attack: 0, strength: 0, defense: 0, speed: 0, gold: 0, xp: 0, drops: [], dropsInput: '' }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }
</script>
