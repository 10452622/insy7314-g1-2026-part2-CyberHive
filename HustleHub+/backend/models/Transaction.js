//IIE, 2026
const mongoose = require('mongoose');

//IIE, 2026
const transactionSchema = new mongoose.Schema({
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    orderId: { type: String, required: true },
    type: { type: String, enum: ['Income', 'Withdrawal', 'Refund'], default: 'Income' },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Completed', 'Pending', 'Failed'], default: 'Completed' },
    date: { type: Date, default: Date.now }
});

//IIE, 2026
module.exports = mongoose.model('Transaction', transactionSchema);

/*Reference List:
The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of Education: Unpublished.*/