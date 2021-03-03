import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

class sendMailService {

    private client: Transporter
    
    constructor () {
        nodemailer.createTestAccount()
        .then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });

            this.client = transporter;
        })
    }

    async execute (to: string, subject: string, variables: object, path: string) {

        const templateFileContent = fs.readFileSync(path).toString('utf-8')
        
        const mailTemplate = handlebars.compile(templateFileContent)

        const html = mailTemplate(variables)

        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: "NPS <noreply@nps.com>"
        })

        console.log('Message sent: %s', message.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}

export default new sendMailService();