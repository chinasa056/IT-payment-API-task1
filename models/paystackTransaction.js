const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Success", "Failed"],
        default: "Pending"
    },
    paymentDate: {
        type: String,
        required: true
    }
}, { timestamps: true })

const transactionModel = mongoose.model("Transactions", transactionSchema)

module.exports = transactionModel