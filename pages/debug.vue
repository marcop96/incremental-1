<template>
  <div class="flex">
    <form
      id="item-form"

      class="max-w-lg w-1/2 mx-auto p-4 mt-12 bg-white shadow-md rounded-md"
      @submit.prevent="submitForm(item)"
    >
      <p class="text-center text-2xl">
        Item
      </p>
      <div class="space-y-4">
        <div>
          <label
            for="id"
            class="block text-sm font-medium text-gray-700"
          >ID:</label>
          <input
            id="id"
            v-model="item.id"
            type="number"
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
        </div>
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-gray-700"
          >Name:</label>
          <input
            id="name"
            v-model="item.name"
            type="text"
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
        </div>
        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-700"
          >Description:</label>
          <input
            id="description"
            v-model="item.description"
            type="text"
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
        </div>
        <div>
          <label
            for="value"
            class="block text-sm font-medium text-gray-700"
          >Value:</label>
          <input
            id="value"
            v-model="item.value"
            type="number"
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
        </div>
        <div>
          <label
            for="icon"
            class="block text-sm font-medium text-gray-700"
          >Icon:</label>
          <input
            id="icon"
            v-model="item.icon"
            type="text"
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
        </div>
      </div>
      <div class="mt-6">
        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </div>
    </form>
    <form
      id="resource-form"
      class="max-w-lg w-1/2 mx-auto p-4 mt-12 bg-white shadow-md rounded-md"
      @submit.prevent="createResource(resource)"
    >
      <p class="text-center text-2xl">
        Resource
      </p>
      <div class="space-y-4">
        <div>
          <label
            for="id"
            class="block text-sm font-medium text-gray-700"
          >ID:</label>
          <input
            id="id"
            v-model="resource.id"
            type="number"
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
        </div>
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-gray-700"
          >Name:</label>
          <input
            id="name"
            v-model="resource.name"
            type="text"
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
        </div>
        <div>
          <label
            for="skill-id"
            class="block text-sm font-medium text-gray-700"
          >Skill ID:</label>
          <input
            id="description"
            v-model="resource.skillId"
            type="text"
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
        </div>
        <div>
          <label
            for="required-level"
            class="block text-sm font-medium text-gray-700"
          >Required Level:</label>
          <input
            id="description"
            v-model="resource.requiredLevel"
            type="text"
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
        </div>
        <div>
          <label
            for="experience-given"
            class="block text-sm font-medium text-gray-700"
          >Experience Given:</label>
          <input
            id="description"
            v-model="resource.experienceGiven"
            type="text"
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
        </div>
        <div>
          <label
            for="time-to-gather"
            class="block text-sm font-medium text-gray-700"
          >Time to gather:</label>
          <input
            id="value"
            v-model="resource.timeToGather"
            type="number"
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
        </div>
        <div>
          <label
            for="reward-id"
            class="block text-sm font-medium text-gray-700"
          >Reward id:</label>
          <input
            id="icon"
            v-model="resource.rewardId"
            type="text"
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
        </div>
      </div>
      <div class="mt-6">
        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang='ts'>
import type { Item, Resource } from '~/types'

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
  rewardId: 23,
})
async function submitForm(item: Item) {
  try {
    await $fetch('api/addItem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    })
      .then((response) => {
        if ((response as Response).ok) {
          console.log('Item added successfully')
        }
      })
  }
  catch (error) {
    console.error('An error occurred:', error)
  }
}

async function createResource(resource: Resource) {
  try {
    await $fetch('api/addResource', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resource),
    })
      .then((response) => {
        if ((response as Response).ok) {
          console.log('Resource added successfully')
        }
      })
  }
  catch (error) {
    console.error('An error occurred:', error)
  }
}
</script>
