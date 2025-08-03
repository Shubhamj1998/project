import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    fetch('http://54.211.11.10:3000/api', {
      headers: { Host: '54.211.11.10' }
    })
      .then(response => response.json())
      .then(data => setData(data.message))
      .catch(error => setData('Error connecting to backend'));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h1>Frontend React App!! todays sunday enjoy your day </h1>
      <p>{data}</p>
    </div>
  );
}

export default App;
