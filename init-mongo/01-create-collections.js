const db = new Mongo().getDB("next-news");
db.createCollection("feeds");
db.feeds.createIndex({ url: 1 }, { unique: true });
