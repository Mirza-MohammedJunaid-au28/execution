const configJson = require("../config/config.json");
const nodemailer = require("nodemailer");

async function sendNotification(req, res) {
    try{
        const email = req.email;
        const result = await sendMail(req.body,email);
        if(result.error == true){
            return res.status(500).render('errors/something');
        }
        return res.status(200).send(result.msg);
    }
    catch(err){
        console.log("Login Controller Error : ",err)
    }
}

async function sendMail(data,email) {

    try{

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: configJson.adminEmail,
                pass: configJson.adminPassword,
            },
        });
    
        const mailOptions = {
            from: configJson.adminEmail,
            to: email,
            subject: "Reminder ! from Execution",
            text: `Hi this is Reminder that you have add a task : "${data.content}" at ${data.time} so it's time to Execute it`,
        };
    
        transporter.sendMail(mailOptions, result = (err, res) => {
            if (err) {
                const resp = {
                    error: true,
                    msg: err,
                };
                return resp;
            } else {
                const resp = {
                    error: false,
                    msg: "Ok",
                };
                return resp;
            }
        });
        return result();
    }
    catch(err){
        console.log("Error While Sending Notification : ",err);
    }
}

module.exports = { sendNotification };
