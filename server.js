require("dotenv").config();
require("./config/database");
require("./utils/redis.js");
const express = require("express");
const cors = require("cors")

const PORT = process.env.PORT || 1112;

const app = express();

const paystackRouter = require("./routes/paystackRoute.js");

app.use(express.json());
app.use(cors());

app.use('/api/v1', paystackRouter)

app.use((error, req, res, next) => {
  if(error){
     return res.status(400).json({message:  error.message})
  }
  next()
})

const swaggerJsdoc = require("swagger-jsdoc");
const swagger_UI = require("swagger-ui-express");

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "Payment Integration Task",
      version: '1.0.0',
      description: "Documentation for InternPulse Task, a platform that allows small business owners accept payment using paystack payment gateway",
      license: {
        name: 'BASE_URL:https://hubspot-k95r.onrender.com',
      },
      contact: {
        name: "Chinasa Acha",
         url: 'https://www.linkedin.com/in/chinasa-acha'
      }
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
           bearerFormat: "JWT"
        }
      }
    }, 
    security: [{ BearerAuth: [] }],
    servers: [
      {
        url: "https://hubspot-k95r.onrender.com",
        description: "Production Server"
      },
      {
        url: "http://localhost:1112",
        description: "Development Server"
      }
    ],
    
  },
  apis: ["./routes/*.js"]
};

const openapiSpecification = swaggerJsdoc(options);
app.use("/paymentdoc", swagger_UI.serve, swagger_UI.setup(openapiSpecification))



app.listen(PORT, () => {
  console.log(`server is listening to port: ${PORT}`);

})