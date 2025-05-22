const { settings } = require("../settings/application");
const client = require("../utils/cloudRedis");
const redis = require("../utils/redis");

// exports.cacheTransactionInitialization = async (email, data) => {
//     try {
//         const cacheKey = `TRANSACTION_KEY:${email}`;

//         return await client.set(cacheKey, JSON.stringify(data), 'EX', Number(settings.duration));
//     } catch (error) {
//         console.log('Unable to cache data on redis', error);
//     }
// };

exports.cacheTransactionInitialization = async (email, data) => {
    try {
        const cacheKey = `TRANSACTION_KEY:${email}`;
        const duration = Number(settings.duration); 

        return await client.set(cacheKey, JSON.stringify(data), {
            EX: duration,
        });
    } catch (error) {
        console.error('Unable to cache data on Redis:', error);
    }
};



exports.getCacheTransactionInitialization = async (email) => {
    try {
        const cacheKey = `TRANSACTION_KEY:${email}`;
        const cachedData = await client.get(cacheKey);

        return JSON.parse(cachedData);
    } catch (error) {
        console.log('Unable to get data on redis', error);
    }
};
