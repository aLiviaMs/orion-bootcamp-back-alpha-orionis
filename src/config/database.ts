import { DataSource } from 'typeorm';

export const MongoDBDataSource = new DataSource({
  name: 'default',
  type: 'mongodb',
  authSource: 'admin',
  database: process.env.DB_DATABASE,
  url: process.env.DB_CONNECTION_STRING,
  entities: ['src/entity/*.ts', 'entity/*.js'],
  logging: true,
  synchronize: true
});
