require("dotenv").config();
require("./config/database")
const redis = require("./utils/redis.js");
const { redisclient } = require("./utils/cloudRedis.js");
const express = require("express");

const PORT = process.env.PORT || 1112;

const app = express();

const userRoute = require('./routes/userRoute');
const paystackRouter = require("./routes/paystackRoute.js");

app.use(express.json());
app.use('/api/v1', userRoute)
app.use('/api/v1', paystackRouter)

redis.on("connect", () => console.log("connection to redis successful")
);
redis.on('error', () => console.log('Unable to connect to redis')
);



app.listen(PORT, () => {
  redisclient()
  console.log(`server is listening to port: ${PORT}`);

})