import express from "express";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail"
import { client } from "../index.js"

const router = express.Router();
const CLIENT_URL = "https://inspiring-ramanujan-6d5121.netlify.app"


router.route('/').put(async (req, res) => {
    const { email } = req.body;

    const existUser = await client.db("crm").collection("users").findOne({ email: email }) //to check whether the user is present or not

    if (!existUser) {                                          //return if email not exists
        return res.status(400).send({ message: "User with this email doesn't exists." })
    }

    //creating token
    const token = jwt.sign({ _id: existUser._id }, process.env.RESET_PASSWORD_KEY, { expiresIn: "20m" })

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)          //sendGrid package for sending email messages
    const msg = {
        to: email,
        from: {
            name: "CRM",
            email: process.env.ACC_EMAIL
        },
        subject: "Your New Password Resetting Link",
        html: `<h2>Please click on given link to reset your password</h2>
            <p>${CLIENT_URL}/reset-password/${token}</p>`
    }

    try {
        await client.db("crm").collection("users").updateOne({ email: email }, { $set: { resetLink: token } })      //update the token in db
        return sgMail
            .send(msg)
            .then(() => {
                return res.send({ message: "Email has been sent!" })        //mail will send only if the token is valid
            })
            .catch((error) => {
                return res.send({ message: error })
            })

    }
    catch (err) {
        return res.status(500).send({ message: err })
    }
});

export const forgotPasswordRouter = router;