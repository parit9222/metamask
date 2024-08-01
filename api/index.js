import express from "express";
import cors from 'cors';
import tokenRoute from './routes/token.route.js';
import dotenv from 'dotenv';
import bodyParser from "body-parser";

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api', tokenRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
