import { client } from "./index.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

async function createLeadsById(data) {
    return await client.db("crm").collection("leads").insertMany(data);
}
async function getAllLeads(leads) {
    return await client.db("crm").collection("leads").find(leads).toArray();
}

async function generatePassword(password) {

    const NO_OF_ROUNDS = 10;
    const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
    console.log(salt);
    const hashedPassword = await bcrypt.hash(password, salt)
    console.log(hashedPassword)
    return hashedPassword;

}

export { createLeadsById, generatePassword, getAllLeads }