const fs = require('node:fs/promises')
const nfs = require('node:fs')
require("dotenv").config();

const mail = require('./mail.js')
const formats = require('./file_formats.js')
const body_schema = require('./body_schema.js')


const fast = require("fastify")(
    {  logger: { level: 'info', stream: nfs.createWriteStream(process.env.INFO_LOG_FILE, {flags: 'a'}) } }
);


fast.get("/", (_, __) => {
  return { message: "Student Affairs' Mailing Microservice" };
});



fast.post('/send', body_schema, async (req, res) => {
    try{
        const body = req.body
        const mail_content = {
            from: process.env.USER,
            to: body.to,
            subject: body.subject,
            text: body.text
        }
        const attachments = []
        if('attachments' in body) {
            for(let {filename, path} of body.attachments){
                const file_ext = path.split('.').pop()

                if(!(file_ext in formats) ) {
                    fast.log.error(`Invalid file type: ${file_ext}`)
                    res.status(400)
                    return {success: false, msg: 'Invalid file type.'}
                }
                
                const base64 = await fs.readFile(path, {encoding: 'base64'})
                
 
                const prefix = `data:${formats[file_ext]};base64,`
                attachments.push({
                    filename: `${filename}.${file_ext}`,
                    path: `${prefix}${base64}`,
                })

            }
        }
        
        if(attachments.length) mail_content.attachments = attachments
        const info = await mail.sendMail(mail_content)
        return res.send({success: true, msg: 'Mail send successfully', info})
    }catch(e) {
        fast.log.error(e)
        res.status(500)
        return {success: false, msg: 'Internal Server Error. Please try again later.'}
    }
    
})

const start = async () => {
  try {
    fast.listen({port: process.env.PORT, host: '0.0.0.0'}, (err) => {
        if(err) {
            throw new Error(err)
        }else{
            console.log(`Mail service running on port ${process.env.PORT}`);
        }
    });
  } catch (e) {
    fast.log.error(e);
    process.exit(1);
  }
};

start();
