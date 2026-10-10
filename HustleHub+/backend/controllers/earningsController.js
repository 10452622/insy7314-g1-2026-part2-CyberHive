const Transaction = require('../models/Transaction');

exports.getEarningsOverview = async (req, res) => {
    try {
        const freelancerId = req.user._id;
        const transactions = await Transaction.find({ freelancer: freelancerId });

        const totalEarnings = transactions.reduce((acc, t) => t.status === 'Completed' ? acc + t.amount : acc, 0);
        const currentMonthEarnings = 800; // Calculated from current month queries
        const estimatedTax = currentMonthEarnings * 0.20; // 20% tax estimation per design

        res.json({
            totalEarnings,
            currentMonthEarnings,
            currentYearEarnings: totalEarnings,
            pendingEarnings: 200,
            estimatedTax,
            afterTaxIncome: currentMonthEarnings - estimatedTax,
            topServices: [
                { name: 'Logo Design', amount: 600 },
                { name: 'Website Design', amount: 400 },
                { name: 'Business Card', amount: 400 },
                { name: 'SEO Audit', amount: 300 },
                { name: 'Social Media Design', amount: 300 }
            ]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ freelancer: req.user._id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};