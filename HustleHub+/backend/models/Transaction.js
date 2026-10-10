const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    orderId: { type: String, required: true },
    type: { type: String, enum: ['Income', 'Withdrawal', 'Refund'], default: 'Income' },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Completed', 'Pending', 'Failed'], default: 'Completed' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);