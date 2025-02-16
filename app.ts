import express from 'express';
import cors from 'cors';
import { config } from "./config"
import { userGroupRouter } from "./src/routers/userGroupRouter";
import { errorHandler } from "./src/middlewares/exceptions/errorHandler";
import { userRouter } from "./src/routers/userRouter";
import { questionRouter } from "./src/routers/questionRouter";
import { answerRouter } from "./src/routers/answerRouter"
import { orientationRouter } from "./src/routers/orientationRouter";
import { responseRouter } from "./src/routers/responseRouter";
import { authRouter } from './src/routers/authRoute';


const app = express();

app.use(express.json());
app.options("*", cors());
app.use(cors({
    origin: "*" 
}));
app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use(express.static('public'));
app.use('/user-groups', userGroupRouter);
app.use('/users', userRouter);
app.use('/questions', questionRouter);
app.use('/answers', answerRouter);
app.use('/orientations', orientationRouter);
app.use('/responses', responseRouter);
app.use('/oauth2', authRouter);

app.use(errorHandler);


app.listen(config.PORT, () => console.log("Server is running on the current configuration:", config));
