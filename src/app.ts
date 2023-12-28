// src/app.ts
import express from 'express';
import converterRoutes from './routes/converterRoutes';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
app.use('/convert', converterRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
