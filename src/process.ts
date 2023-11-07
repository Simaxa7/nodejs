import { logger } from "./logger/winstonLogger";

export const processListener = function(){
    process
        .on('unhandledRejection', (reason) => {
            logger.error(reason);
        })
        .on('uncaughtException', err => {
            logger.error(err);
        });
}
