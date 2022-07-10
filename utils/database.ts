import { AbstractCursor, Db, MongoClient, ObjectId, WithId } from "mongodb";
import { isIssuedInLastHour, Token } from "./token";
import { Feed } from "./types";

enum Collections {
  Feeds = "feeds",
  Tokens = "tokens",
}

class Database {
  private client: MongoClient;
  private db: Db;

  constructor() {
    this.client = new MongoClient(process.env["DB_URL"]!);
    this.db = this.client.db("next-news");
  }

  async connect() {
    await this.client.connect();
  }

  async close() {
    await this.client.close();
  }

  private async getDataFromCursor(cursor: AbstractCursor) {
    const documents = [];
    while (await cursor.hasNext()) {
      const document = await cursor.next();
      if (!document) {
        break;
      }
      documents.push(document);
    }
    return documents;
  }

  async getFeeds(tag = "") {
    const collection = this.db.collection<Feed>(Collections.Feeds);
    let cursor;
    if (tag.length === 0) {
      cursor = collection.find();
    } else {
      cursor = collection.find({ tags: tag });
    }
    const feeds = await this.getDataFromCursor(cursor);
    return feeds as WithId<Feed>[];
  }

  async saveFeeds(feeds: Feed[]) {
    const collection = this.db.collection<Feed>(Collections.Feeds);

    const result = await collection.insertMany(feeds);

    return result.insertedCount;
  }

  async deleteFeed(id: string) {
    const collection = this.db.collection<Feed>(Collections.Feeds);
    const objectId = new ObjectId(id);
    const result = await collection.deleteOne({ _id: objectId });

    return result.deletedCount;
  }

  async getTags(limit: number = 6) {
    const collection = this.db.collection<Feed>("feeds");
    const cursor = await collection.aggregate([
      { $project: { tags: 1 } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $count: {} } } },
      { $project: { tag: "$_id", count: 1, _id: 0 } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    const tags = this.getDataFromCursor(cursor);
    return tags;
  }

  async getLatestToken() {
    const collection = this.db.collection<Token>("tokens");

    const cursor = collection.find().sort({ _id: -1 }).limit(1);

    const latestToken = await this.getDataFromCursor(cursor);

    return latestToken[0] as WithId<Token>;
  }

  async saveToken(token: Token) {
    const collection = this.db.collection<Token>("tokens");

    const result = await collection.insertOne(token);

    return result.insertedId;
  }

  async isTokenValid(token: string) {
    const collection = this.db.collection<Token>("tokens");

    const t = await collection.findOne({ token });

    if (!t) {
      return false;
    }
    if (!isIssuedInLastHour(t)) {
      return false;
    }
    return true;
  }
}

export async function getDatabase() {
  const db = new Database();
  await db.connect();
  return db;
}
