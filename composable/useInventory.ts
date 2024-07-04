import { defineStore } from 'pinia'
import type { Item } from '@/types'

export const useInventoryStore = defineStore('inventory', () => {
  const inventory = ref<Item[]>([
    // Initial items can be defined here if needed
  ])

  const addItem = (item: Item) => {
    const foundItem = inventory.value.find(i => i.id === item.id)

    if (foundItem) {
      foundItem.quantity++
    }
    else {
      inventory.value.push({ ...item, quantity: 1 })
    }

    return inventory.value
  }

  const removeItem = (item: Item) => {
    const foundItem = inventory.value.find(i => i.id === item.id)
    if (foundItem && foundItem.quantity > 1) {
      foundItem.quantity--
    }
    else {
      inventory.value = inventory.value.filter(i => i.id !== item.id)
    }
  }
  return {
    inventory,
    addItem,
    removeItem,
  }
})
