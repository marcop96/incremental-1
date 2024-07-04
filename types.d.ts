export interface Skill {
  id: number
  name: string
}

export interface Resource {
  id: number
  name: string
  skillId: number
  requiredLevel: number
  experienceGiven: number
  timeToGather: number
}

export interface Item {
  id: number
  name: string
  description: string
  value: number
  quantity: number
}
