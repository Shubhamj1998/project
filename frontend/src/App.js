import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    fetch('http://testapi.infinydev.com/api')
      .then(response => response.json())
      .then(data => setData(data.message))
      .catch(error => setData('Error connecting to backend'));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h1>Frontend React App</h1>
      <p>{data}</p>
    </div>
  );
}

export default App;
