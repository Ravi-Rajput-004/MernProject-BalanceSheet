const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // Built-in middleware to parse JSON bodies

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/transactions', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  credit: { type: Number, default: 0 },
  debit: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

// Model
const Transaction = mongoose.model('Transaction', transactionSchema);

// Route to add new transaction
app.post('/api/transactions', async (req, res) => {
  const { description, credit, debit } = req.body;

  try {
    const newTransaction = new Transaction({
      description,
      credit,
      debit,
    });

    await newTransaction.save();
    res.status(200).json({ message: 'Transaction saved successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving transaction', error: err.message });
  }
});

// Route to get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching transactions', error: err.message });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
