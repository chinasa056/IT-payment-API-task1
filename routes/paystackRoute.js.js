const {
  initializePyment,
  verifyPament,
} = require("../controllers/paystackTrans");

const router = require("express").Router();

/**
 * @swagger
 * /api/v1/transaction/initialize:
 *   post:
 *     summary: Initialize a new Paystack payment transaction
 *     description: |
 *       This endpoint initiates a payment transaction using the Paystack API. It accepts the payer's name, email, and amount in Naira, 
 *       then returns an authorization URL and transaction reference for the client to complete the payment.

 *       ✅ Redis caching is implemented to prevent abuse — users cannot repeatedly initialize transactions within a short time frame. 
 *       Each user's request is cached by email and restricted based on a duration defined in the app's configuration (e.g. 60 seconds).

 *       ✅ On valid requests:
 *       - Redis is checked to see if the user has initialized a transaction recently.
 *       - If not cached, the server sends a request to Paystack’s `/transaction/initialize` endpoint.
 *       - The transaction is saved to the database (with a reference and date).
 *       - Redis cache is then set to prevent rapid re-initialization.
 *       - Response includes the `authorization_url` and `reference`.

 *       ✅ Jest unit tests validate:
 *       - Proper rejection if cache exists (rate limiting).
 *       - Successful transaction flow.
 *       - Proper handling of external API failure.
 *       - Rejection of incomplete request bodies.

 *       ⚠️ Only valid payloads will be processed. Rate-limiting and validation are enforced to ensure API stability and prevent abuse.
 *       
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - amount
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Chinasa Acha"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "chinasaacha05@gmail.com"
 *               amount:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Payment initialization successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment Initialized Successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     authorization_url:
 *                       type: string
 *                       example: "https://checkout.paystack.com/test_url"
 *                     reference:
 *                       type: string
 *                       example: "test_reference"
 *                 transactionDetails:
 *                   type: object
 *       400:
 *         description: Rate limit exceeded or invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Limit exceeded limit: Try again in 60 seconds"
 *       500:
 *         description: Server error or third-party API failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error Initializing Payment"
 */
router.post("/transaction/initialize", initializePyment);

/**
 * @swagger
 * /api/v1/transaction/verify:
 *   get:
 *     summary: Verify a Paystack payment transaction
 *     description: |
 *       This endpoint verifies the status of a Paystack transaction using the transaction reference captured in query parameter.
 *       
 *       ✅ It calls Paystack’s `/transaction/verify/{reference}` endpoint to confirm the status of the payment.
 *       
 *       ✅ If the payment was successful:
 *       - The transaction record in the database is updated to `Success`.
 *       - A success message with the updated transaction data is returned.
 *       
 *       ❌ If the payment failed:
 *       - The transaction is updated with a `Failed` status.
 *       - A failure message and transaction data are returned.

 *       ⚠️ If the Paystack API is unreachable or returns an error, a 500 response is returned.

 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: reference
 *         schema:
 *           type: string
 *         required: true
 *         description: The transaction reference from Paystack
 *         example: test_reference_123
 *     responses:
 *       200:
 *         description: Payment verified and status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment Successful
 *                 data:
 *                   type: object
 *                   description: The updated transaction data
 *       500:
 *         description: Server error or failure verifying transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error Verifying Payment
 */
router.get("/transaction/verify", verifyPament);

module.exports = router;
