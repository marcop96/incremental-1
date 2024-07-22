import fs from 'fs'
import path from 'path'
import { defineEventHandler, readBody } from 'h3'

const dataFilePath = path.resolve('data/items.json')

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate incoming data
    if (!body.id || !body.name || !body.description || !body.value || !body.icon) {
      return { statusCode: 400, body: { message: 'Missing required fields' } }
    }

    // Read existing data
    let items = []
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, 'utf-8')
      items = JSON.parse(fileContent)
    }

    // Append new item
    items.push(body)

    // Write updated data back to file
    fs.writeFileSync(dataFilePath, JSON.stringify(items, null, 2), 'utf-8')

    return { statusCode: 200, body: { message: 'Item added successfully', data: body } }
  }
  catch (error) {
    console.error('Error:', error)
    return { statusCode: 500, body: { message: 'Internal Server Error', error: error } }
  }
})
