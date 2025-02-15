import { promises as fs } from 'fs'
import path from 'path'
import type { Item } from '~/types'

export default defineEventHandler(async (event) => {
  const updatedItem = await readBody<Item>(event)
  const filePath = path.resolve(process.cwd(), 'data', 'items.json')
  const fileData = await fs.readFile(filePath, 'utf-8')
  const items: Item[] = JSON.parse(fileData)

  const index = items.findIndex((item) => item.id === updatedItem.id)
  if (index === -1) {
    return { success: false, error: 'Item not found' }
  }
  items[index] = updatedItem
  await fs.writeFile(filePath, JSON.stringify(items, null, 2))
  return { success: true, item: updatedItem }
})
