import "./setup/setup";

import express from 'express';
import cors    from 'cors';

import loginRouter      from './routes/login';
import objectRouter     from './routes/object';

const app = express();


app.use(cors());
app.use(express.json());

// 라우터 정의
app.use('/login',      loginRouter);
app.use('/object',     objectRouter);


app.listen(10001, () => { console.log("server is running on 10001"); });
