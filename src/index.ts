import createApplication from './app';
import { logger } from './logger/winstonLogger';
import { processListener } from './process';
import {GroupService} from './services/groupService';
import {UserService} from './services/userService';

const application = createApplication(new UserService(), new GroupService());

application.listen(process.env.DB_PORT, () => {
    logger.info(`App listening at http://localhost:${process.env.DB_PORT}`)
});

console.log('process.env.DB_PORT', process.env.DB_PORT);
//handle unhandled errors
processListener();
