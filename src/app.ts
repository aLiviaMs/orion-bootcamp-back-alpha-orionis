import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { MongoDBDataSource } from './config/database';
import { swaggerConfig } from './config/swagger';
import routes from './routes';
import cron from 'node-cron';
import { sendNewsletter } from './utils/newsletter';
import { invalidJSONHandler } from './middleware/invalidJSONHandler';

MongoDBDataSource.initialize()
  .then(() => {
    console.log('Database initialized!');
    cron.schedule('0 11 * * *', sendNewsletter, {
      scheduled: true,
      timezone: 'America/Sao_Paulo'
    });
  })
  .catch((err) => {
    console.error('Database Error: ', err);
  });

const app = express();

app.use(helmet());
app.use(express.json());
app.use(invalidJSONHandler);
app.use(cors({ origin: true }));
app.use(routes);

const swaggerSpec = swaggerJSDoc(swaggerConfig);

app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.get('/swagger.json', (_req, res) => res.send(swaggerSpec));

console.log(`Add swagger on /swagger`);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server listening on port ${process.env.SERVER_PORT}`);
});
