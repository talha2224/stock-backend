const { storage } = require("../config/firebase.config");
const { getDownloadURL, ref, uploadBytes } = require("@firebase/storage");
const twilio = require('twilio');
require("dotenv").config()

const accountSid = process.env.accountSid
const authToken = process.env.authToken;
const twilioPhoneNumber = process.env.twilioPhoneNumber;

const client = twilio(accountSid, authToken);


module.exports = {
    uploadFile: (async (file) => {
        const uniqueFilename = `${file.originalname}-${Date.now()}`;
        const storageRef = ref(storage, `${uniqueFilename}`);
        await uploadBytes(storageRef, file.buffer);
        const result = await getDownloadURL(storageRef);
        let downloadUrl = result;
        return downloadUrl
    }),
    sendOtp: async (phoneNumber, otp) => {
        try {
            const message = await client.messages.create({ body: `Your OTP for hop on account verification is: ${otp}`, from: twilioPhoneNumber, to: phoneNumber, });
            console.log('Message sent:', message.sid);
            return { success: true, sid: message.sid };
        }
        catch (error) {
            console.error('Error sending OTP:', error);
            return { success: false, error: error.message };
        }
    },
    generatePin: () => {
        return Math.floor(10000 + Math.random() * 90000).toString();
    },


}