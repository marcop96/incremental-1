export interface Skill {
  id: number
  name: string
  level: number
  xp: number
  isGathering: boolean
  isCombat?: boolean
}

export interface Resource {
  id: number
  name: string
  skillId: number
  requiredLevel: number
  experienceGiven: number
  timeToGather: number
  itemId: number
}

export interface Item {
  id: number
  name: string
  description: string
  value: number
  quantity: number
  icon: string
}

export interface Monster {
  id: number
  name: string
  level: number
  health: number
  currentHealth: number
  attack: number
  strength: number
  defense: number
  speed: number
  gold: number
  xp: number
  drops: Drop[]
}

export interface Drop {
  name: string
  chance: number
}
