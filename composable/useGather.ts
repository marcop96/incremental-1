import { defineStore } from 'pinia'

import type { Item, Resource } from '@/types'
import { useInventoryStore } from '~/composable/useInventory'

export const useGatherStore = defineStore('gather', () => {
  const inventoryStore = useInventoryStore()

  const gatherResource = (resource: Resource, reward: Item) => {
    // Gather the resource
    inventoryStore.addItem(reward)
    // Reward the player
    console.log(`You got 1 ${reward.name}`)
  }

  return {
    gatherResource,
  }
})
