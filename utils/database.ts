import { Db, MongoClient } from "mongodb";

export async function connectToDatabase(): Promise<MongoClient> {
  const client = new MongoClient(process.env["DB_URL"]!);
  await client.connect();

  return client;
}

export async function getFeeds(db: Db) {
  const collection = db.collection("feeds");

  const feeds = collection.find();

  return feeds;
}

export interface Token {
  token: string;
  issuedAt: number;
}

export async function getLatestToken(db: Db) {
  const collection = db.collection<Token>("tokens");

  const latestToken = collection.find().sort({ _id: -1 }).limit(1);

  return latestToken;
}

export async function saveToken(db: Db, token: Token) {
  const collection = db.collection<Token>("tokens");

  const result = await collection.insertOne(token);

  return result.insertedId;
}
