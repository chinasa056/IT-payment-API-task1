const { settings } = require("../settings/application");
const redis = require("../utils/redis");

exports.cacheTransactionInitialization = async (email, data) => {
    try {
        const cacheKey = `TRANSACTION_KEY:${email}`;

        return await redis.set(cacheKey, JSON.stringify(data), 'EX', Number(settings.duration));
    } catch (error) {
        console.log('Unable to cache data on redis', error);
    }
};

exports.getCacheTransactionInitialization = async (email) => {
    try {
        const cacheKey = `TRANSACTION_KEY:${email}`;
        const cachedData = await redis.get(cacheKey);

        return JSON.parse(cachedData);
    } catch (error) {
        console.log('Unable to get data on redis', error);
    }
};
