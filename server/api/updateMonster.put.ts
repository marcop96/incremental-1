import { promises as fs } from 'fs'
import path from 'path'
import type { Monster } from '~/types'

export default defineEventHandler(async (event) => {
  const updatedMonster = await readBody<Monster>(event)
  const filePath = path.resolve(process.cwd(), 'data', 'monsters.json')
  const fileData = await fs.readFile(filePath, 'utf-8')
  const monsters: Monster[] = JSON.parse(fileData)

  const index = monsters.findIndex((m) => m.id === updatedMonster.id)
  if (index === -1) {
    return { success: false, error: 'Monster not found' }
  }
  monsters[index] = updatedMonster
  await fs.writeFile(filePath, JSON.stringify(monsters, null, 2))
  return { success: true, monster: updatedMonster }
})
