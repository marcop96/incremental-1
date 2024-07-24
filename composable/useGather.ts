import { defineStore } from 'pinia'
import items from '~/data/items.json'
import type { Resource, Item } from '@/types'
import { useInventoryStore } from '~/composable/useInventory'
import { usePlayerStore } from '~/composable/usePlayer'
import { useSkillStore } from '~/composable/useSkills'

export const useGatherStore = defineStore('gather', () => {
  const inventoryStore = useInventoryStore()
  const playerStore = usePlayerStore()
  const skillStore = useSkillStore()

  const progress = ref(0)
  const currentProgress = ref(0)
  let interval: string | number | NodeJS.Timeout | null | undefined = null

  const gatherResource = (resource: Resource) => {
    if (interval) {
      resetProgress()
    }
    if (!skillStore.activeSkill?.isGathering) {
      // Check if the resource requires an item to be consumed
      const requiredItem = items.find(item => item.id === resource.itemId) as Item
      const inventoryItem = inventoryStore.findItemById(requiredItem.id)
      if (!inventoryItem || inventoryItem.quantity < 1) {
        console.error('You do not have the required item to gather this resource')
        return
      }
    }
    interval = setInterval(() => {
      currentProgress.value++

      if (currentProgress.value <= 100) {
        progress.value = currentProgress.value
      }
      else {
        if (skillStore.activeSkill?.isGathering === false) {
          inventoryStore.removeItem(items.find(item => item.id === resource.itemId) as Item)
          playerStore.addExperience(resource.skillId, resource.experienceGiven)
        }
        if (skillStore.activeSkill?.isGathering === true) {
          giveResourceFromItem(resource)
          playerStore.addExperience(resource.skillId, resource.experienceGiven)
        }
        resetProgress()
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
    const rewardItem = items.find(item => item.id === resource.itemId) as Item
    if (rewardItem) {
      inventoryStore.addItem(rewardItem)
    }
    else {
      console.error('No item found for rewardId:', resource.itemId)
    }
  }

  return {
    gatherResource,
    progress,
  }
})
