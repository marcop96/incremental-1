import { defineStore } from 'pinia'
import items from '~/data/items.json'
import type { Resource, Item } from '@/types'
import { useInventoryStore } from '~/composable/useInventory'
import { usePlayerStore } from '~/composable/usePlayer'

export const useGatherStore = defineStore('gather', () => {
  const inventoryStore = useInventoryStore()
  const playerStore = usePlayerStore()
  const progress = ref(0)
  const currentProgress = ref(0)
  let interval: string | number | NodeJS.Timeout | null | undefined = null

  const gatherResource = (resource: Resource) => {
    if (interval) {
      resetProgress()
    }

    interval = setInterval(() => {
      currentProgress.value++

      if (currentProgress.value <= 100) {
        progress.value = currentProgress.value
      }
      else {
        clearInterval(interval as number)
        interval = null
        giveResourceFromItem(resource)
        console.log('Resource gathered', resource.timeToGather, 'seconds')
        currentProgress.value = 0
        progress.value = 0
      }
    }, resource.timeToGather * 10)
  }
  const resetProgress = () => {
    clearInterval(interval as number)
    interval = null
    progress.value = 0
    currentProgress.value = 0
  }
  const giveResourceFromItem = (resource: Resource) => {
    const rewardItem = items.find(item => item.id === resource.rewardId) as Item
    if (rewardItem) {
      inventoryStore.addItem(rewardItem)
      playerStore.addExperience(resource.skillId, resource.experienceGiven)
    }
    else {
      console.error('No item found for rewardId:', resource.rewardId)
    }
  }

  return {
    gatherResource,
    progress,
  }
})
