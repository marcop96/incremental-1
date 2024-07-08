import { defineStore } from 'pinia'
import items from '~/data/items.json'
import type { Resource } from '@/types'

import { useInventoryStore } from '~/composable/useInventory'
import { usePlayerStore } from '~/composable/usePlayer'

export const useGatherStore = defineStore('gather', () => {
  const inventoryStore = useInventoryStore()
  const usePlayer = usePlayerStore()

  const gatherResource = (resource: Resource) => {
    giveResourceFromItem(resource)
  }

  const giveResourceFromItem = (resource: Resource) => {
    const rewardItem = items.find(item => item.id === resource.rewardId)
    if (rewardItem) {
      console.log('Found item:', rewardItem)
      inventoryStore.addItem(rewardItem)
      usePlayer.addExperience(resource.experienceGiven)
    }
    else {
      console.log('No item found')
    }
  }

  return {
    gatherResource,
  }
})
