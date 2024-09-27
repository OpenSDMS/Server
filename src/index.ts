
import express from 'express';

import deviceRouter     from './routes/device';
import repositoryRouter from './routes/repository';
import userRouter       from './routes/user';

const app = express();

app.use(express.json());
app.use('/device',     deviceRouter);
app.use('/repository', repositoryRouter);
app.use('/user',       userRouter);

app.listen(3001, () => { console.log("Hello, world"); });
