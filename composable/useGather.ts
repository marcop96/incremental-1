import { defineStore } from 'pinia'
import items from '~/data/items.json'
import type { Resource, Item } from '@/types'
import { useInventoryStore } from '~/composable/useInventory'
import { usePlayerStore } from '~/composable/usePlayer'
import { useSkillStore } from '~/composable/useSkills'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()

export const useGatherStore = defineStore('gather', () => {
  const inventoryStore = useInventoryStore()
  const playerStore = usePlayerStore()
  const skillStore = useSkillStore()

  const progress = ref(0)
  const currentProgress = ref(0)
  let interval: string | number | NodeJS.Timeout | null | undefined = null
  const activeResource = ref<Resource | null>(null)

  const checkIfResourceIsGatherable = (resource: Resource) => {
    if (skillStore.activeSkill?.isGathering === false) {
      const requiredItem = items.find(item => item.id === resource.itemId) as Item
      const inventoryItem = inventoryStore.findItemById(requiredItem.id)
      if (!inventoryItem || inventoryItem.quantity < 1) {
        toast({
          title: `Oh no!`,
          description: `You don't have any ${resource.name} for this`,
          variant: 'destructive',
        })
        return false
      }
    }
    return true
  }
  const stopGathering = () => {
    clearInterval(interval as number)
    interval = null
    progress.value = 0
    currentProgress.value = 0
    activeResource.value = null
  }

  const toggleGathering = (resource: Resource) => {
    if (interval) {
      stopGathering()
    }
    else {
      startGathering(resource)
    }
  }

  const startGathering = (resource: Resource) => {
    if (!checkIfResourceIsGatherable(resource)) return

    activeResource.value = resource

    interval = setInterval(() => {
      if (!checkIfResourceIsGatherable(resource)) {
        stopGathering()
        return
      }
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
    stopGathering }
})
