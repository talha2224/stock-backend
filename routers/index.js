const combineRouter = require("express").Router()


combineRouter.use("/account",require("./account.router"))
combineRouter.use("/card",require("./card.router"))





module.exports = combineRouter