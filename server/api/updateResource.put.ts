import { promises as fs } from 'fs'
import path from 'path'
import type { Resource } from '~/types'

export default defineEventHandler(async (event) => {
  const updatedResource = await readBody<Resource>(event)
  const filePath = path.resolve(process.cwd(), 'data', 'resources.json')
  const fileData = await fs.readFile(filePath, 'utf-8')
  const resources: Resource[] = JSON.parse(fileData)

  const index = resources.findIndex((r) => r.id === updatedResource.id)
  if (index === -1) {
    return { success: false, error: 'Resource not found' }
  }
  resources[index] = updatedResource
  await fs.writeFile(filePath, JSON.stringify(resources, null, 2))
  return { success: true, resource: updatedResource }
})
