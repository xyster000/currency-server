import { MongoClient, Db } from 'mongodb';

export const MongoProvider = {
  provide: 'MONGO_DB',
  useFactory: async (): Promise<Db> => {
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    return client.db('currency_db');
  },
};