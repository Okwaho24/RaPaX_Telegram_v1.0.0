const fs = require('fs');
const path = require('path');
const WALLETS = require('../config/wallets.json');

class PaymentService {
    constructor() {
        this.fiatEnabled = process.env.FIAT_ENABLED === 'true';
    }

    generateCryptoAddress(assetType, expectedAmount, invoiceId) {
        const address = WALLETS[assetType.toUpperCase()];
        if (!address) {
            throw new Error(`Unsupported or unconfigured asset type: ${assetType}`);
        }
        return {
            invoiceId,
            asset: assetType.toUpperCase(),
            destinationAddress: address,
            amount: expectedAmount,
            status: 'PENDING_MEMPOOL_MONITOR'
        };
    }

    async handlePayPalWebhook(event) {
        if (!this.fiatEnabled) {
            throw new Error('Fiat processing is disabled via environment configuration.');
        }

        switch (event.event_type) {
            case 'PAYMENT.CAPTURE.COMPLETED':
                const resource = event.resource;
                return {
                    success: true,
                    rail: 'PAYPAL',
                    transactionId: resource.id,
                    amount: resource.amount.value,
                    currency: resource.amount.currency_code,
                    buyerEmail: resource.payer?.email_address
                };
            default:
                return { success: false, status: 'IGNORED_EVENT' };
        }
    }
}

module.exports = new PaymentService();
