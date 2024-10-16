
import "./setup/setup";

import express from 'express';
import cors    from 'cors';

import authRouter   from './routes/auth';
import objectRouter from './routes/object';
import uploadRouter from './routes/upload';
import agentRouter  from './routes/agent';

const app = express();

app.use(cors({ origin: [
  'http://localhost:3000'
]}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/upload', uploadRouter);
app.use('/api/login',  authRouter);
app.use('/api/object', objectRouter);
app.use('/api/agent',  agentRouter);

app.listen(10001, () => {
  console.log("server is running on 10001");
});
