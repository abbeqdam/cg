// netlify/functions/save-shown-usrnames.js

const fetch = require('node-fetch');

const API_KEY = process.env.JSONBIN_API_KEY; // Get the API key from environment variables
const BIN_ID = process.env.JSONBIN_BIN_ID;

exports.handler = async function (event, context) {
  try {
    const shownUsrnames = JSON.parse(event.body);

    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY,
      },
      body: JSON.stringify({ words: shownUsrnames }),
    });

    if (!response.ok) {
      throw new Error(`JSONbin.io request failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Shown usernames saved successfully', data }),
    };
  } catch (error) {
    console.error('Error saving shown usernames:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save shown usernames' }),
    };
  }
};