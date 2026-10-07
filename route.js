
//dependencies
import sampleHandler from "./handlers/routeHandlers/sampleHandler.js";
import userhandler from "./handlers/routeHandlers/userHandler.js";

const routes={
    sample:sampleHandler.sampleHandler,
    user:userhandler.userHandler
};

export default routes;

