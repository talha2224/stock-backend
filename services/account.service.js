const { AccountModel } = require("../models/account.model");
const bcrypt = require("bcryptjs")
const { generatePin, uploadFile, sendOtp } = require("../utils/function");
const { sendDynamicMail } = require("../utils/email");






// NORMAL AUTH FLOW 
const createAccount = async (req, res) => {
    try {
        let { email, password } = req.body
        let alreadyExits = await AccountModel.findOne({ email })
        if (alreadyExits) {
            return res.status(400).json({ data: { accountVerified: alreadyExits?.accountVerified, userInfo: alreadyExits }, msg: "Account already exits with this email", code: 400 })
        }
        let hash = await bcrypt.hash(password, 10)
        let result = await AccountModel.create({ email, password: hash })
        return res.status(200).json({ data: result, msg: "Account Created", status: 200 })
    }
    catch (error) {
        console.log(error)
    }
}

const updateAccountOnboardingData = async (req, res) => {
    try {
        let { first_name, last_name, phone } = req.body
        let { id } = req?.params
        let alreadyExits = await AccountModel.findById(id)
        if (!alreadyExits) {
            return res.status(400).json({ data: { accountVerified: alreadyExits?.accountVerified, userInfo: null }, msg: "Account not exits with this email", code: 400 })
        }
        let result = await AccountModel.findByIdAndUpdate(id, { first_name, last_name, phone }, { new: true })
        return res.status(200).json({ data: result, msg: "Account Details Updated", status: 200 })

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Internal server error", error });
    }
}

const loginAccount = async (req, res) => {
    try {
        let { email, password } = req.body

        let findUser = await AccountModel.findOne({ email })
        console.log(findUser)
        if (!findUser) {
            return res.status(400).json({ data: null, msg: "Account not exits with this email", code: 400 })
        }
        else if (findUser?.accountBlocked) {
            return res.status(400).json({ data: findUser, msg: "Account has been deleted", code: 400 })
        }
        else {
            let compare = await bcrypt.compare(password, findUser.password)
            if (compare) {
                return res.status(200).json({ data: findUser, msg: "Login Sucessful", code: 200 })
            }
            else {
                return res.status(403).json({ data: null, msg: "Invalid credentails", code: 403 })
            }
        }
    }
    catch (error) {
        console.log(error)
    }
}

const resendOtp = async (req, res) => {
    try {
        let { email } = req.body

        let findUser = await AccountModel.findOne({ email })
        if (!findUser) {
            return res.status(400).json({ data: null, msg: "Account not exits with this email", code: 400 })
        }
        let name = findUser?.first_name?.length > 0 ? findUser?.first_name : email.split("@")[0]
        let pin = generatePin()
        await sendDynamicMail("verification", email, name, pin);
        await AccountModel.findByIdAndUpdate(findUser?._id, { otp: pin, otpVerified: false }, { new: true })
        return res.status(200).json({ data: null, msg: "OTP send sucessfully to email", code: 200 })
    }
    catch (error) {
        console.log(error)
    }
}
const verifyOtp = async (req, res) => {
    try {
        let { email, otp } = req.body
        let user = await AccountModel.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ data: null, msg: "Account not exits with this email", code: 400 })
        }
        else {
            if (otp == user?.otp) {
                let verifiedResponse = await AccountModel.findByIdAndUpdate(user?._id, { otp: null, otpVerified: true, accountVerified: true }, { new: true })
                return res.status(200).json({ data: verifiedResponse, msg: "Account Verified", code: 200 })
            }
            else {
                return res.status(403).json({ msg: "Invalid Otp", code: 403 })
            }

        }

    }
    catch (error) {
        console.log(error)
    }
}

const changePassword = async (req, res) => {
    try {
        let { email, password } = req.body
        let user = await AccountModel.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ data: null, msg: "Account not exits with this email", code: 400 })
        }
        else {
            if (user?.otpVerified) {
                let hash = await bcrypt.hash(password, 10)
                let verifiedResponse = await AccountModel.findByIdAndUpdate(user?._id, { password: hash }, { new: true })
                return res.status(200).json({ data: verifiedResponse, msg: "Password Changed", code: 200 })
            }
            return res.status(403).json({ data: user, msg: "OTP NOT VERIFIED", code: 200 })


        }

    }
    catch (error) {
        console.log(error)
    }
}
const changePasswordByPassword = async (req, res) => {
    try {
        let { id, oldPassword, newPassword } = req.body
        let user = await AccountModel.findById(id)
        if (!user) {
            return res.status(400).json({ data: null, msg: "Account not exits with this email", code: 400 })
        }
        else {
            let compare = await bcrypt.compare(oldPassword, user.password)
            if (compare) {
                let hash = await bcrypt.hash(newPassword, 10)
                let verifiedResponse = await AccountModel.findByIdAndUpdate(id, { password: hash }, { new: true })
                return res.status(200).json({ data: verifiedResponse, msg: "Password Changed", code: 200 })
            }
            return res.status(403).json({ data: null, msg: "Current Password NOT Valid", code: 403 })


        }

    }
    catch (error) {
        console.log(error)
    }
}


const deleteAccount = async (req, res) => {
    try {
        let { id } = req.params
        await AccountModel.findByIdAndUpdate(id, { accountBlocked: true })
        return res.status(200).json({ data: null, msg: "Account Deleted", code: 200 })
    }
    catch (error) {
        console.log(error)
    }
}
const reactivateAccount = async (req, res) => {
    try {
        let { id } = req.params
        await AccountModel.findByIdAndUpdate(id, { accountBlocked: false })
        return res.status(200).json({ data: null, msg: "Account Activated", code: 200 })
    }
    catch (error) {
        console.log(error)
    }
}

const getAccountById = async (req, res) => {
    try {
        let findUser = await AccountModel.findById(req.params.id)
        return res.status(200).json({ data: findUser, code: 200 })
    }
    catch (error) {
        console.log(error)
    }
}
const getAllAccount = async (req, res) => {
    try {
        let findUser = await AccountModel.find({})
        return res.status(200).json({ data: findUser, code: 200 })

    }
    catch (error) {
        console.log(error)
    }
}

const uploadPicture = async (req, res) => {
    try {
        let { id } = req.params;
        let image = req.file
        let url = await uploadFile(image);
        console.log(url, 'url')
        let updateProfile = await AccountModel.findByIdAndUpdate(id, { profile: url }, { new: true })
        return res.status(200).json({ data: updateProfile, msg: "Profile Picture Updated" })
    }
    catch (error) {
        console.log(error)
    }
}

const updateProfile = async (req, res) => {
    try {
        let { id } = req.params;
        let { firstName, lastName, email } = req.body
        let updateProfile = await AccountModel.findByIdAndUpdate(id, { firstName, lastName, email }, { new: true })
        return res.status(200).json({ data: updateProfile, msg: "Profile Data Updated" })
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = {updateAccountOnboardingData, uploadPicture, createAccount, loginAccount, getAccountById, resendOtp, verifyOtp, getAllAccount, deleteAccount, updateProfile, reactivateAccount, changePassword, changePasswordByPassword }
