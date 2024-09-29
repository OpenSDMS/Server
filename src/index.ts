
import express from 'express';
import cors    from 'cors';

import deviceRouter     from './routes/device';
import repositoryRouter from './routes/repository';
import userRouter       from './routes/user';

const app = express();


app.use(cors());
app.use(express.json());


// 라우터 정의
app.use('/device',     deviceRouter);
app.use('/repository', repositoryRouter);
app.use('/user',       userRouter);

app.listen(10001, () => { console.log("server is running on 10001"); });
