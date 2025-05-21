const { initializePyment, verifyPament } = require("../controllers/paystackTrans")

const router = require("express").Router()

router.post("/transaction/initialize", initializePyment);

router.get("/payment/verify", verifyPament)

module.exports = router