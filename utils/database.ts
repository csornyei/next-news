import { Db, MongoClient, ObjectId } from "mongodb";
import { isIssuedInLastHour, Token } from "./token";
import { Feed } from "./types";

export async function connectToDatabase(): Promise<MongoClient> {
  const client = new MongoClient(process.env["DB_URL"]!);
  await client.connect();

  return client;
}

export async function getFeeds(db: Db) {
  const collection = db.collection<Feed>("feeds");

  const cursor = collection.find();

  return cursor;
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

export async function isTokenValid(db: Db, token: string): Promise<boolean> {
  const collection = db.collection<Token>("tokens");

  const t = await collection.findOne({ token });

  if (!t) {
    return false;
  }
  if (!isIssuedInLastHour(t)) {
    return false;
  }
  return true;
}

export async function saveFeeds(db: Db, feeds: Feed[]) {
  const collection = db.collection<Feed>("feeds");

  const result = await collection.insertMany(feeds);

  return result.insertedCount;
}

export async function deleteFeed(db: Db, id: string) {
  const collection = db.collection<Feed>("feeds");
  const objectId = new ObjectId(id);
  const result = await collection.deleteOne({ _id: objectId });

  return result.deletedCount;
}
