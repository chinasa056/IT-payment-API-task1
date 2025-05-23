const { createClient } = require ("redis");
const { settings } = require("../settings/application");

const client =  createClient({
    username: settings.redis.client_username,
    password:settings.redis.client_password,
    socket: {
        host: settings.redis.cient_host,
        port: settings.redis.client_port
    }
});

client.on("connect", () => console.log("connection to redis cloud successful"));

client.on('error', err => console.log('Redis Client Error', err));

if(!client.isOpen) {
     client.connect();
}


module.exports = client

