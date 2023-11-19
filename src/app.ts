import express from 'express';
import "reflect-metadata";
import cors from 'cors';
import * as dotenv from 'dotenv'
import { createUserRouter } from './routes/user';
import { createGroupRouter } from './routes/group';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware';
import { loggerMiddleware } from './middlewares/loggerMiddleware';
import { checkTokenMiddleware } from './middlewares/checkTokenMiddleware';
import type { GroupService } from './services/groupService';
import type { UserService } from './services/userService';

export default function createApplication(userService:UserService, groupService:GroupService) {
    const app = express();
    dotenv.config()

    // Enable Cross Origin Resource Sharing to all origins by default
    app.use(cors());
    // Transforms the raw string of req.body into json
    app.use(express.json());
    //load common middlewares
    app.use(loggerMiddleware);
    //check token
    app.use(checkTokenMiddleware);
    // Load API routes
    app.use(createUserRouter(userService), createGroupRouter(groupService));
    // app.use(user, group);
    //load error handler
    app.use(errorHandlerMiddleware);

    return app
}
