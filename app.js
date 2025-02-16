"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const userGroupRouter_1 = require("./src/routers/userGroupRouter");
const errorHandler_1 = require("./src/middlewares/exceptions/errorHandler");
const userRouter_1 = require("./src/routers/userRouter");
const questionRouter_1 = require("./src/routers/questionRouter");
const answerRouter_1 = require("./src/routers/answerRouter");
const orientationRouter_1 = require("./src/routers/orientationRouter");
const responseRouter_1 = require("./src/routers/responseRouter");
const authRoute_1 = require("./src/routers/authRoute");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.options("*", (0, cors_1.default)());
app.use((0, cors_1.default)({
    origin: "*"
}));
app.set('view engine', 'ejs');
app.set('views', 'src/views');
app.use(express_1.default.static('public'));
app.use('/user-groups', userGroupRouter_1.userGroupRouter);
app.use('/users', userRouter_1.userRouter);
app.use('/questions', questionRouter_1.questionRouter);
app.use('/answers', answerRouter_1.answerRouter);
app.use('/orientations', orientationRouter_1.orientationRouter);
app.use('/responses', responseRouter_1.responseRouter);
app.use('/oauth2', authRoute_1.authRouter);
app.use(errorHandler_1.errorHandler);
app.listen(config_1.config.PORT, () => console.log("Server is running on the current configuration:", config_1.config));
