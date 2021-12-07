import express from "express";
import { createLeadsById, getAllLeads } from "../helper.js";

const router = express.Router();

router.route("/").get(async (request, response) => {

    console.log(request.query);
    const leads = request.query;
    console.log(leads);
    const leadsList = await getAllLeads(leads);
    response.send(leadsList);
}).post(async (request, response) => {
    const data = request.body;
    const result = await createLeadsById(data);
    response.send(result);
});


export const leadsRouter = router;