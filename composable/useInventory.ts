import { defineStore } from 'pinia'
import itemDataBase from '../data/items.json'
import type { Item, ItemWithoutID } from '@/types'

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
    if (name) {
      const foundItem = itemDataBase.find(item => item.name === name)
      if (foundItem !== undefined) {
        return foundItem // Return the found item
      }
      else {
        console.warn(`Item ${name} not found in database`)
        return null
      }
    }
    else if (id) {
      const foundItem = itemDataBase.find(item => item.id === id)
      if (foundItem !== undefined) {
        return foundItem // Return the found item
      }
      else {
        console.warn(`Item with id ${id} not found in database`)
        return null
      }
    }

    return null
  }

  const addItemToDataBase = (item: ItemWithoutID) => {
    const foundItem = findItemInDataBase(item.name)

    if (foundItem === null) {
      // Obtener el nuevo ID
      const lastItem = itemDataBase[itemDataBase.length - 1]
      const newItemId = lastItem ? lastItem.id + 1 : 1

      // Crear un nuevo objeto con el ID incluido
      const newItem: Item = { ...item, id: newItemId }

      itemDataBase.push(newItem)
      console.log(`Item ${newItem.name} added to database with ID ${newItemId}`)
    }
    else {
      console.warn(`Item ${item.name} already exists in database`)
    }
  }

  return {
    inventory,
    addItem,
    removeItem,
    findItemById,
    findItemByName,
    findItemInDataBase,
    addItemToDataBase,
  }
})
