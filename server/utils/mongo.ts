import { MongoClient, type Db, type Collection } from 'mongodb'

let client: MongoClient | null = null
let dbInstance: Db | null = null

interface FeeDocument {
  protocol: string
  attribute: string
  date: string
  value: number
}

async function getClient(): Promise<MongoClient | null> {
  const config = useRuntimeConfig()

  if (!config.mongoUri) {
    console.warn('Env var MONGO_URI not set, MongoDB will be disabled')
    return null
  }

  if (!client) {
    client = new MongoClient(config.mongoUri)
    await client.connect()
  }

  return client
}

async function getDb(): Promise<Db | null> {
  if (dbInstance) return dbInstance

  const mongoClient = await getClient()
  if (!mongoClient) return null

  dbInstance = mongoClient.db('cryptofees')
  return dbInstance
}

async function getCollection(): Promise<Collection<FeeDocument> | null> {
  const db = await getDb()
  if (!db) return null

  return db.collection<FeeDocument>('fee_cache')
}

export async function mongoGet(query: {
  protocol: string
  attribute: string
  date: string
}): Promise<FeeDocument | null> {
  const collection = await getCollection()
  if (!collection) return null

  return collection.findOne(query)
}

export async function mongoSet(doc: FeeDocument): Promise<void> {
  const collection = await getCollection()
  if (!collection) return

  await collection.updateOne(
    {
      protocol: doc.protocol,
      attribute: doc.attribute,
      date: doc.date,
    },
    { $set: doc },
    { upsert: true }
  )
}

export async function closeMongoConnection(): Promise<void> {
  if (client) {
    await client.close()
    client = null
    dbInstance = null
  }
}
