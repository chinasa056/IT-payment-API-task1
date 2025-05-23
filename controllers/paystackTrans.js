const { cacheTransactionInitialization, getCacheTransactionInitialization } = require("../helpers/utilities");
const transactionModel = require("../models/paystackTransaction")
const axios = require("axios");
const redis = require("../utils/redis");
const { settings } = require("../settings/application");
const formattedDate = new Date().toLocaleString();

exports.initializePyment = async (req, res) => {
    try {
        const { name, email, amount } = req.body;
        const getCachedData = await getCacheTransactionInitialization(email);
        if (getCachedData) {
            return res.status(400).json({
                message: `Limit exceeded limit: Try again in ${settings.duration} seconds`
            })
        }

        await cacheTransactionInitialization(email, amount);

        const paymentData = {
            name,
            amount: amount * 100,
            email
        };

        const response = await axios.post("https://api.paystack.co/transaction/initialize", paymentData, {
            headers: {
                Authorization: `Bearer ${settings.paystack_secret}`
            }
        });
        // console.log(response.data);


        const { data } = response

        const payment = new transactionModel({
            name,
            amount,
            email,
            reference: data?.data?.reference,
            paymentDate: formattedDate
        })

        await payment.save();
        res.status(200).json({
            message: "Payment Initialized Successfully",
            data: {
                authorization_url: data?.data?.authorization_url,
                reference: data?.data?.reference
            },
            transactionDetails: payment
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Error Initializing Payment"
        })

    }
};

exports.verifyPament = async (req, res) => {
    try {
        const { reference } = req.query;

        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${settings.paystack_secret}`
            }
        });

        const { data } = response
        if (data?.data?.status && data?.data?.status === "success") {
            const transaction = await transactionModel.findOneAndUpdate({ reference }, { status: "Success" }, { new: true });

            res.status(200).json({
                message: "Payment Successful",
                data: transaction
            })
        } else {
            const transaction = await transactionModel.findOneAndUpdate({ reference }, { status: "Failed" }, { new: true });

            res.status(200).json({
                message: "Payment Failed",
                daa: transaction
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Error Verifying Payment"
        })
    }
};
