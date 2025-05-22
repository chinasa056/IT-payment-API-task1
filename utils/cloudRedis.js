const { createClient } = require ("redis");
const { settings } = require("../settings/application");

const client =  createClient({
    username: settings.client_username,
    password:settings.client_password,
    socket: {
        host: settings.cient_host,
        port: settings.client_port
    }
});

client.on("connect", () => console.log("connection to redis cloud successful"));

client.on('error', err => console.log('Redis Client Error', err));

if(!client.isOpen) {
     client.connect();
}


module.exports = client

