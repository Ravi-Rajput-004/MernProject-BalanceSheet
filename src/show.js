import React, { useState, useEffect } from "react";

const TransactionList = ({ refreshTrigger }) => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/transactions");
      const data = await response.json();
      calculateRunningBalance(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions(); // Initial fetch
  }, []);

  useEffect(() => {
    if (refreshTrigger !== null) {
      fetchTransactions(); // Re-fetch when trigger changes
    }
  }, [refreshTrigger]);

  const calculateRunningBalance = (transactions) => {
    let balance = 0;
    const updated = transactions.map((t) => {
      balance += (t.credit || 0) - (t.debit || 0);
      return { ...t, runningBalance: balance };
    });
    setTransactions(updated);
  };

  return (
    <div className="container mt-5">
      <h2>OFFICE TRANSACTION:-</h2>
      <table className="table table-striped" border="2" style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <thead style={{ backgroundColor: "orange" }}>
          <tr>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Credit</th>
            <th style={thStyle}>Debit</th>
            <th style={thStyle}>Running Balance</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No transactions available.</td>
            </tr>
          ) : (
            transactions.map((t, i) => (
              <tr key={i}>
                <td style={tdStyle}>{new Date(t.date).toLocaleDateString()}</td>
                <td style={tdStyle}>{t.description}</td>
                <td style={tdStyle}>{t.credit ? `$${t.credit.toFixed(2)}` : "-"}</td>
                <td style={tdStyle}>{t.debit ? `$${t.debit.toFixed(2)}` : "-"}</td>
                <td style={tdStyle}>{typeof t.runningBalance === "number" ? `$${t.runningBalance.toFixed(2)}` : "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = { padding: "10px", textAlign: "center" };
const tdStyle = { padding: "10px", textAlign: "center" };

export default TransactionList;
