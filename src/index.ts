
import "./setup/setup";

import express from 'express';
import cors    from 'cors';

import loginRouter  from './routes/login';
import objectRouter from './routes/object';
import uploadRouter from './routes/upload';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/upload', uploadRouter);
app.use('/api/login',  loginRouter);
app.use('/api/object', objectRouter);

app.listen(10001, () => {
  console.log("server is running on 10001");
});
