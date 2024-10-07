import "./setup/setup";

import express, { urlencoded } from 'express';
import cors    from 'cors';

import loginRouter      from './routes/login';
import objectRouter     from './routes/object';
import uploadRouter     from './routes/upload';

const app = express();


app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

// 라우터 정의
app.use('/login',      loginRouter);
app.use('/object',     objectRouter);
app.use('/upload',     uploadRouter);


app.listen(10001, () => { console.log("server is running on 10001"); });
