import nodemailer from 'nodemailer'

const transpoter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        type:"OAuth2",
        user:process.env.GOOGLE_USER,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        refreshToken:process.env.GOOGLE_REFRESH_TOKEN,
        clientId:process.env.GOOGLE_CLIENT_ID
    },

})


transpoter.verify().then(()=>{console.log('email transpoter is ready to send emails');
})

.catch((err)=>{console.error("email transpoter varification failed", err)})

export async function sendEmails({to,subject,html,text}) {
    const mailOptions={
        from:process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text
    }
    
    const details = await transpoter.sendMail(mailOptions)
    console.log("email sent", details);
    

    return "email sent successfully, to"+ to;
}