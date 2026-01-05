import { createClient, type RedisClientType } from 'redis'

let client: RedisClientType | null = null
let connecting: Promise<void> | null = null

async function getClient(): Promise<RedisClientType | null> {
  const config = useRuntimeConfig()

  if (!config.redisUrl) {
    console.warn('Env var REDIS_URL not set, Redis will be disabled')
    return null
  }

  if (!client) {
    client = createClient({ url: config.redisUrl })

    client.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })

    // Ensure we only connect once
    if (!connecting) {
      connecting = client.connect()
    }

    await connecting
  }

  return client
}

export async function redisGet(key: string): Promise<string | null> {
  const redisClient = await getClient()
  if (!redisClient) return null

  try {
    return await redisClient.get(key)
  } catch (error) {
    console.error('Redis get error:', error)
    return null
  }
}

export async function redisSet(key: string, value: string | number): Promise<void> {
  const redisClient = await getClient()
  if (!redisClient) return

  try {
    await redisClient.set(key, String(value))
  } catch (error) {
    console.error('Redis set error:', error)
  }
}

export async function redisSetEx(
  key: string,
  value: string | number,
  ttlSeconds: number
): Promise<void> {
  const redisClient = await getClient()
  if (!redisClient) return

  try {
    await redisClient.setEx(key, ttlSeconds, String(value))
  } catch (error) {
    console.error('Redis setEx error:', error)
  }
}

export async function redisDel(key: string): Promise<void> {
  const redisClient = await getClient()
  if (!redisClient) return

  try {
    await redisClient.del(key)
  } catch (error) {
    console.error('Redis del error:', error)
  }
}

export async function closeRedisConnection(): Promise<void> {
  if (client) {
    await client.quit()
    client = null
    connecting = null
  }
}
