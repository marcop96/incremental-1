import { defineStore } from 'pinia'
import itemDataBase from '../data/items.json'
import type { Item } from '@/types'

export const useInventoryStore = defineStore('inventory', () => {
  const inventory = ref<Item[]>([
    {
      id: 1,
      name: 'Sword',
      description: 'A sharp blade used for combat.',
      value: 50,
      quantity: 1,
      icon: 'noto:crossed-swords',
    },
  ])

  // Add item to inventory
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

  // Find item by id
  const findItemById = (id: number) => {
    const foundItem = inventory.value.find(i => i.id === id)
    return foundItem
  }
  const findItemByName = (name: string) => {
    const foundItem = inventory.value.find(i => i.name === name)
    return foundItem
  }
  // Remove item from inventory
  const removeItem = (item: Item) => {
    const foundItem = findItemById(item.id)
    if (foundItem && foundItem.quantity > 1) {
      foundItem.quantity--
    }
    else {
      inventory.value = inventory.value.filter(i => i.id !== item.id)
    }
  }
  const findItemInDataBase = (name?: string, id?: number) => {
    if (name) return itemDataBase.find(item => item.name === name) || null
    else return itemDataBase.find(item => item.id === id) || null
  }

  return {
    inventory,
    addItem,
    removeItem,
    findItemById,
    findItemByName,
    findItemInDataBase,
  }
})
