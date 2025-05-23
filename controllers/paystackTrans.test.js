const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const transactionModel = require('../models/paystackTransaction');
const utilities = require('../helpers/utilities');
const { initializePyment } = require('./paystackTrans');

jest.mock('../utils/redis', () => {
    return {
        set: jest.fn(),
        get: jest.fn(),
        del: jest.fn(),
        quit: jest.fn().mockResolvedValue('OK'),
    };
});
jest.mock('axios');
jest.mock('../models/paystackTransaction');
jest.mock('../helpers/utilities');

afterAll(async () => {
    const redis = require('../utils/redis');
    if (redis.quit) {
        await redis.quit();
    }
});

describe('Paystack Transaction Controller - initializePyment', () => {
    let req, res;
    
    beforeEach(() => {
        req = {
            body: {
                name: 'Test User',
                email: 'test@example.com',
                amount: 1000
            }
        };
        
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        
        jest.clearAllMocks();
        
        process.env.TRANSACTION_KEY_DURATION = '60';
        process.env.PAYSTACK_SECRET_KEY = 'sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    });

    it('should return 400 if user has already initiated a transaction recently', async () => {
        utilities.getCacheTransactionInitialization.mockResolvedValue(true);
        
        await initializePyment(req, res);
        
        expect(utilities.getCacheTransactionInitialization).toHaveBeenCalledWith('test@example.com');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.status(400).json).toHaveBeenCalled();
    });

    it('should initialize payment successfully', async () => {
        utilities.getCacheTransactionInitialization.mockResolvedValue(false);
        utilities.cacheTransactionInitialization.mockResolvedValue(null);
        
        const mockPaystackResponse = {
            data: {
                status: true,
                message: 'Authorization URL created',
                data: {
                    authorization_url: 'https://checkout.paystack.com/test_url',
                    access_code: 'test_access_code',
                    reference: 'test_reference'
                }
            }
        };
        
        axios.post.mockResolvedValue(mockPaystackResponse);
        
        const mockPayment = {
            name: 'Test User',
            email: 'test@example.com',
            amount: 1000,
            reference: 'test_reference',
            paymentDate: expect.any(String)
        };
        
        transactionModel.mockImplementation(() => {
            return {
                save: jest.fn().mockResolvedValue(mockPayment)
            };
        });
        
        await initializePyment(req, res);
        
        expect(utilities.cacheTransactionInitialization).toHaveBeenCalledWith('test@example.com', 1000);
        
        expect(axios.post).toHaveBeenCalled();
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Payment Initialized Successfully',
            data: {
                authorization_url: 'https://checkout.paystack.com/test_url',
                reference: 'test_reference'
            },
            transactionDetails: expect.any(Object)
        });
    });

    it('should handle errors during payment initialization', async () => {
        utilities.getCacheTransactionInitialization.mockResolvedValue(false);
        utilities.cacheTransactionInitialization.mockResolvedValue(null);
        
        const errorMessage = 'API Error';
        axios.post.mockRejectedValue(new Error(errorMessage));
        
        await initializePyment(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error Initializing Payment'
        });
    });
    
    it('should handle missing required fields in request body', async () => {
        req.body = { 
            name: 'Test User',
        };
        
        utilities.getCacheTransactionInitialization.mockResolvedValue(false);
        
        await initializePyment(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
    });
});
