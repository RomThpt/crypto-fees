import { mongoGet, mongoSet } from './mongo'
import { redisGet, redisSet } from './redis'

/**
 * Get a cached value from Redis, falling back to MongoDB
 */
export async function getValue(
  protocol: string,
  attribute: string,
  date: string
): Promise<number | null> {
  const key = `${protocol}-${attribute}-${date}`

  // Try Redis first
  const redisVal = await redisGet(key)

  if (redisVal && redisVal !== 'NaN') {
    return parseFloat(redisVal)
  }

  // Fall back to MongoDB
  const response = await mongoGet({ protocol, attribute, date })

  if (response && !isNaN(response.value)) {
    const value = parseFloat(String(response.value))
    // Cache in Redis for future requests
    await redisSet(key, value)
    return value
  }

  return null
}

/**
 * Set a value in both Redis and MongoDB
 */
export async function setValue(
  protocol: string,
  attribute: string,
  date: string,
  value: number
): Promise<void> {
  const key = `${protocol}-${attribute}-${date}`

  await Promise.all([
    mongoSet({ protocol, attribute, date, value }),
    redisSet(key, value),
  ])
}
