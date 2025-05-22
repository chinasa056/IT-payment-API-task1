const { createClient } = require ("redis")

exports.redisclient = async () => {
const client =  createClient({
    username: 'default',
    password: 'Eg9izebQdaVPaa1wJs82V6qVFI5TtZCp',
    socket: {
        host: 'redis-15206.c74.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 15206
    }
});

client.on("connect", () => console.log("connection to redis cloud successful"));

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)  // >>> bar
}

