const axios = require('axios');

async function testAPI() {
  const API_KEY = process.env.CLASH_ROYALE_API_TOKEN;
  
  if (!API_KEY) {
    console.log('CLASH_ROYALE_API_TOKEN is not set in environment');
    return;
  }

  try {
    console.log('Testing official Clash Royale API...');
    const response = await axios.get('https://api.clashroyale.com/v1/cards', {
      headers: {
        Authorization: API_KEY,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response data type:', typeof response.data);
    console.log('Response data keys:', Object.keys(response.data));
    console.log('Has items?', 'items' in response.data);
    
    if (response.data.items) {
      console.log('Number of items:', response.data.items.length);
      console.log('Sample item:', response.data.items[0]);
    } else {
      console.log('Data structure:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
  }
}

testAPI();