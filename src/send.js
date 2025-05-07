import React, { useEffect, useState } from 'react';
import TransactionList from './show';

const AddTransaction = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [currentBalance, setCurrentBalance] = useState(0);
  const [refreshFlag, setRefreshFlag] = useState(Date.now());

  const fetchBalance = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/transactions");
      const data = await res.json();
      const balance = data.reduce((acc, t) => acc + (t.credit || 0) - (t.debit || 0), 0);
      setCurrentBalance(balance);
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleSave = async () => {
    const amt = parseFloat(amount);
    if (!description || !transactionType || isNaN(amt) || amt <= 0)
      return alert('Please fill all fields correctly.');

    if (transactionType === 'debit' && amt > currentBalance)
      return alert('Insufficient balance!');

    const data = {
      description,
      credit: transactionType === 'credit' ? amt : 0,
      debit: transactionType === 'debit' ? amt : 0,
      date: new Date(),
    };

    try {
      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Transaction saved!");
        setDescription('');
        setAmount('');
        setTransactionType('');
        fetchBalance();
        setRefreshFlag(Date.now()); // trigger refresh in child
      } else {
        alert("Failed to save.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving transaction.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Add New Transaction</h2>
        <div style={styles.formGroup}>
          <label style={styles.label}>Current Balance: ${currentBalance.toFixed(2)}</label>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Description:</label>
          <input type="text" style={styles.input} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Transaction Type:</label>
          <select style={styles.select} value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
            <option value="">-- Select Type --</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Amount:</label>
          <input type="number" style={styles.input} value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <button style={styles.button} onClick={handleSave}>Save Transaction</button>
      </div>
      <TransactionList refreshTrigger={refreshFlag} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '100vh',
    paddingTop: '30px',
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    width: '400px',
    textAlign: 'center',
    marginRight: '30px',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#555',
    display: 'block',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    outline: 'none',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default AddTransaction;
