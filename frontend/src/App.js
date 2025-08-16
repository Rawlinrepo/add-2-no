import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [result, setResult] = useState(null);
  const [results, setResults] = useState([]); // history

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  console.log(`Server running on ${API_URL}`);

  // Fetch all results from DB
  const fetchResults = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/results`);
      setResults(res.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  // Run once on page load
  useEffect(() => {
    fetchResults();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (num1 === '' || num2 === '') {
      alert('Please enter both numbers before submitting.');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/add`, { num1, num2 });
      setResult(res.data.result);

      // Refresh results list
      fetchResults();
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(`Server Error: ${error.response.status} - ${error.response.data.message || 'An error occurred on the server.'}`);
      } else if (error.request) {
        alert('Network Error: No response from server. Please check your connection or server status.');
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div style={{ backgroundColor: 'blue', color: 'white', minHeight: '100vh', padding: '20px' }}>
      <h1>Add Two Numbers</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="number" 
          value={num1} 
          onChange={(e) => setNum1(e.target.value)} 
          placeholder="First number"
          style={{ margin: '5px', padding: '5px' }}
        />
        <input 
          type="number" 
          value={num2} 
          onChange={(e) => setNum2(e.target.value)} 
          placeholder="Second number"
          style={{ margin: '5px', padding: '5px' }}
        />
        <button type="submit" style={{ margin: '5px', padding: '5px' }}>Add</button>
      </form>

      {result !== null && <h2>Latest Result: {result}</h2>}

      <h2>All Results</h2>
      <table style={{ width: '100%', backgroundColor: 'white', color: 'black', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '5px' }}>Num1</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Num2</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Result</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r._id}>
              <td style={{ border: '1px solid black', padding: '5px' }}>{r.num1}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{r.num2}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{r.result}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{new Date(r.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
