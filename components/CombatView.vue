<script setup lang="ts">
import { useSkillStore } from '../composable/useSkills'
import monsters from '../data/monsters.json'

const skillStore = useSkillStore()
const combatStats = skillStore.skills.filter(skill => skill.isCombat)

const attack = combatStats.filter(stat => stat.name === 'attack')
const defense = combatStats.filter(stat => stat.name === 'defense')
const strength = combatStats.filter(stat => stat.name === 'strength')
const hitpoints = combatStats.filter(stat => stat.name === 'hitpoints')
const player = {
  attack: attack[0].level,
  defense: defense[0].level,
  strength: strength[0].level,
  hitpoints: hitpoints[0].level,
  currentHealth: hitpoints[0].level,
}

const monster = {
  id: 1,
  name: 'Goblin',
  health: 10,
  attack: 5,
  defense: 2,
  speed: 3,
  gold: 5,
  xp: 10,
}

function combatLoop() {
  // get both stats
  // player attacks first
  // attack speed is based on player weapon speed
  // roll for damage based on player and monster stats
  // remove health from monster
  // give exp based on skill chosen and damage number rolled
  // monster attacks
  // roll for damage based on player and monster stats
  // remove health from player
  // if player health is 0, end combat
  // if monster health is 0, end combat
  // if combat continues, loop back to player attack
  // player can choose to run away
  // player can eat whenever he wants, but it takes a turn
  // turns are 'live'  with a progress bar that fills up and then waits till monster bars fills up

}
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-gray-800 min-w-screen text-white p-4">
    <!-- Combat Area -->
    <div class="w-full max-w-5xl grid grid-cols-2 gap-6">
      <!-- Player Section -->
      <div class="flex flex-col items-center bg-green-500 p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">
          Player
        </h2>
        <div class="w-32 h-32 bg-green-700 rounded-full mb-4">
          <!-- Player Avatar -->
          <!-- <img
           src="/images/player.png"
          alt="Player"
          class="w-full h-full rounded-full object-cover"
          > -->
        </div>
        <div class="space-y-2">
          <p>Health: {{ player.hitpoints }} / {{ player.hitpoints }}</p>
          <p>Attack: {{ player.attack }}</p>
          <p>Strength: {{ player.strength }}</p>
          <p>Defense: {{ player.defense }}</p>
          <!-- <p>Level: {{ player.level }}</p> -->
        </div>
      </div>

      <!-- Monster Section -->
      <div class="flex flex-col items-center bg-red-500 p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">
          Monster
        </h2>
        <div class="w-32 h-32 bg-red-700 rounded-full mb-4">
          <!-- Monster Avatar -->
          <!-- <img
            src="/images/monster.png"
            alt="Monster"
            class="w-full h-full rounded-full object-cover"
          > -->
        </div>
        <div class="space-y-2">
          <p> {{ monster.name }}</p>
          <p>Health: {{ monster.health }} / {{ monster.health }}</p>
          <p>Attack: {{ monster.attack }}</p>
          <p>Defense: {{ monster.defense }}</p>
          <!-- <p>Level: {{ monster.level }}</p> -->
        </div>
      </div>
      <div
        class="flex w-screen justify-center"
      >
        <p
          class=" "
        >
          {{ monster.name }} attacks you for {{ monster.attack }} damage!
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add some extra styling if needed */
</style>
