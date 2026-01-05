import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import router from './routes/route';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', router);
mongoose.connect('mongodb://localhost:27017/pharmacy').then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});