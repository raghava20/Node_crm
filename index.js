import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt, { hash } from "bcrypt";
import { leadsRouter } from "./routers/leads.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());


const MONGO_URL = process.env.MONGO_URL;

async function createConnect() {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongodb connected!");
    return client;
}
export const client = await createConnect();

app.get("/", (request, response) => {

    response.send("Hello World...");

})

app.use("/leads", leadsRouter);


app.listen(PORT, () => console.log("App is started in ", PORT));
