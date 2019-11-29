import mailgun from 'mailgun-js';
import logger from '../loaders/logger';

class AppUtil {
    constructor() {}

    private static mg = mailgun({ apiKey: global['gConfig'].MAIL_API_KEY
                                , domain: global['gConfig'].MAIL_DOMAIN });

    public static sendMail(to: string, subject: string, body: string) {
        const mailData = {
            from: 'Dating App <datingapp@mail.com>',
            to,
            subject,
            html: body
        };

        try {
            AppUtil.mg.messages().send(mailData);
        } catch (err) {
            logger.error(`Error occured at utils.AppUtil:sendMail - ${err.message}`);
        }
    }

}

export default AppUtil;
