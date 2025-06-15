const router = require("express").Router()
const { multipleupload } = require("../config/multer.config")
const {updateAccountOnboardingData,createAccount, loginAccount, getAccountById, resendOtp, verifyOtp, getAllAccount, uploadPicture, updateProfile, deleteAccount,reactivateAccount, changePassword, changePasswordByPassword} = require("../services/account.service")

router.post("/register",createAccount)
router.put("/update/onboarding/data/:id",updateAccountOnboardingData)
router.post("/login",loginAccount)
router.post("/send/otp",resendOtp)
router.post("/verify/otp",verifyOtp)
router.post("/change/password",changePassword)
router.post("/change/password/by/password",changePasswordByPassword)
router.put("/change/profile/:id",multipleupload.single("image"),uploadPicture)
router.put("/update/profile/:id",updateProfile)
router.delete("/delete/account/:id",deleteAccount)
router.put("/reactivate/account/:id",reactivateAccount)
router.get("/single/:id",getAccountById)
router.get("/all",getAllAccount)



module.exports = router
