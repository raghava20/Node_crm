import express from "express";
import { createLeadsById, getAllLeads, deleteLead, updateLeadsById, getAdmins } from "../helper.js";
import sgMail from "@sendgrid/mail"

const router = express.Router();

router.route("/").get(async (request, response) => {
    const leadsList = await getAllLeads();
    response.send(leadsList);
}).post(async (request, response) => {
    const data = request.body;

    const result = await createLeadsById(data);
    const getUsers = await getAdmins()

    const email = getUsers.map(user => user.email)          //to get admin & manager emails
    if (email) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)          //sendGrid package for sending email messages
        const msg = {
            to: email,
            from: {
                name: "CRM",
                email: process.env.ACC_EMAIL
            },
            subject: "New Lead has been created",
            html: `<h2>Below is the new Lead generated from our end.</h2>
            <p>Name: ${data.name}</p>
            <p>Email: ${data.email}</p>
            <p>Contact: ${data.contact}</p>
            <p>Company: ${data.company}</p>
            <p>Status: ${data.status}</p>            
            `
        }
        sgMail.send(msg)
    }
    response.send(result);
})

router.route("/:id").delete(async (request, response) => {
    const { id } = request.params
    const result = await deleteLead(id);
    response.send(result);
}).put(async (request, response) => {
    const { id } = request.params;                                  //Destructured the request
    const { status } = request.body;
    try {
        const result = await updateLeadsById(id, status)
        response.send(result);
    }
    catch (err) {
        response.status(500).send(err)
    }
})

export const leadsRouter = router;