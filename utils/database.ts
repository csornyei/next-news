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
