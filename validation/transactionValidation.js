const joi = require('joi');

exports.initiatiateTransactionSchema = joi.object().keys({
    name: joi.string().min(3).max(20).required(),
    email: joi.string().trim().email().required(),
    amount: joi.string().trim().required(),
});
