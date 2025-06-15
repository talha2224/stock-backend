const { createCard, getCardById, getAllCardsByUserId, updateCardById, deleteCardById } = require("../services/card.service")

const router = require("express").Router()
router.post("/create",createCard)
router.get("/single/:id",getCardById)
router.get("/user/:userId",getAllCardsByUserId)
router.put("/update/:id",updateCardById)
router.delete("/delete/:id",deleteCardById)





module.exports = router