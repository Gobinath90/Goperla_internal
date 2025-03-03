import fs from 'fs'

let globalCounter: number | null = null

export function getOrCreateCounter(): number {
  if (globalCounter !== null) {
    return globalCounter
  }

  const filePath = 'email_counter.txt'
  try {
    let counter = 41
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      // counter = parseInt(fileContent, 10) + 1
      // if (isNaN(counter)) counter = 1
    }
    fs.writeFileSync(filePath, counter.toString())
    globalCounter = counter
    return counter
  } catch (error) {
    console.error('Error managing counter:', error)
    globalCounter = Math.floor(Math.random() * 10000)
    return globalCounter
  }
}
