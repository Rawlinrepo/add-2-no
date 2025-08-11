import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [result, setResult] = useState(null);

  //const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const API_URL = "http://backend:5000";

  console.log(`Server running on ${API_URL}`);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (num1 === '' || num2 === '') {
      alert('Please enter both numbers before submitting.');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/add`, { num1, num2 });
      setResult(res.data.result);
    } catch (error) {
      console.error(error);
      if (error.response) {
        // The server responded with a status code out of the range of 2xx
        alert(`Server Error: ${error.response.status} - ${error.response.data.message || 'An error occurred on the server.'}`);
      } else if (error.request) {
        // The request was made but no response received
        alert('Network Error: No response from server. Please check your connection or server status.');
      } else {
        // Something happened in setting up the request
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '20px' }}>
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
      {result !== null && <h2>Result: {result}</h2>}
    </div>
  );
}

export default App;
