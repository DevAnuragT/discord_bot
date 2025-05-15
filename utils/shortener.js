const { MongoClient } = require('mongodb');
const { nanoid } = require('nanoid');
require('dotenv').config();

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = 'discord_bot';
const collectionName = 'short_urls';

async function connectDB() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
}

async function shortenUrl(originalUrl) {
  await connectDB();

  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const existing = await collection.findOne({ originalUrl });
  if (existing) return existing.shortUrl;

  const shortId = nanoid(6);
  const shortUrl = `https://short.ly/${shortId}`; // Replace with your domain

  await collection.insertOne({ originalUrl, shortUrl, shortId, createdAt: new Date() });
  return shortUrl;
}

async function getOriginalUrl(shortId) {
  await connectDB();

  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const doc = await collection.findOne({ shortId });
  return doc ? doc.originalUrl : null;
}

async function deleteShortUrl(shortId) {
  await connectDB();

  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const result = await collection.deleteOne({ shortId });
  return result.deletedCount > 0;
}

module.exports = { shortenUrl, getOriginalUrl, deleteShortUrl };
