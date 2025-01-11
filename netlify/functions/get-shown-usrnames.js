// netlify/functions/get-shown-usrnames.js

const fetch = require('node-fetch');

const API_KEY = process.env.JSONBIN_API_KEY; // Get the API key from environment variables
const BIN_ID = process.env.JSONBIN_BIN_ID;

exports.handler = async function (event, context) {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`JSONbin.io request failed with status ${response.status}`);
    }

    const data = await response.json();
    const shownUsrnames = data.record.words || [];

    return {
      statusCode: 200,
      body: JSON.stringify(shownUsrnames),
    };
  } catch (error) {
    console.error('Error fetching shown usernames:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch shown usernames' }),
    };
  }
};