<template>
  <form @submit.prevent="submitForm(item)">
    <div>
      <div>
        <label for="id">ID:</label>
        <input
          id="id"
          v-model="item.id"
          type="number"
          required
        >
      </div>
      <div>
        <label for="name">Name:</label>
        <input
          id="name"
          v-model="item.name"
          type="text"
          required
        >
      </div>
      <div>
        <label for="description">Description:</label>
        <input
          id="description"
          v-model="item.description"
          type="text"
          required
        >
      </div>
      <div>
        <label for="value">Value:</label>
        <input
          id="value"
          v-model="item.value"
          type="number"
          required
        >
      </div>

      <div>
        <label for="icon">Icon:</label>
        <input
          id="icon"
          v-model="item.icon"
          type="text"
          required
        >
      </div>
    </div>
    <button type="submit">
      Submit
    </button>
  </form>
</template>

<script setup lang='ts'>
import type { Item } from '~/types'

const item = ref<Item>({
  id: 34,
  name: '4325',
  description: '2345',
  value: 40,
  quantity: 1,
  icon: '2d',
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
</script>

<style scoped>
/* Add your styles here */
</style>
