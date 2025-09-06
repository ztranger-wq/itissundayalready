const express = require('express');
const { handlePineLabsWebhook, handlePineLabsRedirect } = require('../controllers/paymentController');
const router = express.Router();

router.post('/pinelabs/webhook', handlePineLabsWebhook);
router.get('/pinelabs/redirect', handlePineLabsRedirect);

module.exports = router;
