import { MongoClient, Db } from 'mongodb';

export const MongoProvider = {
  provide: 'MONGO_DB',
  useFactory: async (): Promise<Db> => {
    //mongodb://localhost:27017

    const client = new MongoClient('mongodb+srv://xyster:lVDBP8OSfcr7uXVg@cluster0.avqldj6.mongodb.net/');
    await client.connect();
    return client.db('currency_db');
  },
};