import { mongoConnection } from "./utils/dbConnect"

global.afterAll(async () => {
    await mongoConnection.disconnect();
})