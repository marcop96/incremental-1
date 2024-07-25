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
  const activeResource = ref<Resource | null>(null)

  const toggleGathering = (resource: Resource) => {
    if (interval) {
      stopGathering()
    }
    else {
      startGathering(resource)
    }
  }

  const startGathering = (resource: Resource) => {
    if (!skillStore.activeSkill?.isGathering) {
      // Check if the resource requires an item to be consumed
      const requiredItem = items.find(item => item.id === resource.itemId) as Item
      const inventoryItem = inventoryStore.findItemById(requiredItem.id)
      if (!inventoryItem || inventoryItem.quantity < 1) {
        console.error('You do not have the required item to gather this resource')
        return
      }
    }
    activeResource.value = resource

    interval = setInterval(() => {
      gatherAction()
    }, resource.timeToGather * 10)
  }

  const gatherAction = () => {
    currentProgress.value++

    if (currentProgress.value <= 100) {
      progress.value = currentProgress.value
    }
    else {
      const resource = activeResource.value
      if (!resource) return

      if (skillStore.activeSkill?.isGathering === false) {
        const requiredItem = items.find(item => item.id === resource.itemId) as Item
        inventoryStore.removeItem(requiredItem)
        playerStore.addExperience(resource.skillId, resource.experienceGiven)
      }

      if (skillStore.activeSkill?.isGathering === true) {
        giveResourceFromItem(resource)
        playerStore.addExperience(resource.skillId, resource.experienceGiven)
      }

      currentProgress.value = 0
    }
  }

  const stopGathering = () => {
    clearInterval(interval as number)
    interval = null
    progress.value = 0
    currentProgress.value = 0
    activeResource.value = null
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
    toggleGathering,
    progress,
    activeResource,
  }
})
