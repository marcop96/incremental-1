<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useInventoryStore } from '../composable/useInventory'
import { useSkillStore } from '~/composable/useSkills'
import ItemCard from '@/components/ItemCard.vue'
import SkillCard from '~/components/ui/SkillCard.vue'

const inventoryStore = useInventoryStore()
const skillStore = useSkillStore()
const { inventory } = storeToRefs(inventoryStore)
</script>

<template>
  <section class="mx-4 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    <SkillCard
      v-for="skill in skillStore.skills"
      :key="skill.id"
      :skill="skill"
    />
  </section>

  <h2 class="text-xl font-bold">
    Inventory
  </h2>
  <section class="mx-4 w-4/5 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    <ItemCard
      v-for="item in inventory"
      :key="item.id"
      :item="item"
    />
  </section>
</template>
