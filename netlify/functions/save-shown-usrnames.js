const fetch = require('node-fetch');

const API_KEY = process.env.JSONBIN_API_KEY;
const BIN_ID = process.env.JSONBIN_BIN_ID;

exports.handler = async function (event, context) {
  try {
    const shownUsrnames = JSON.parse(event.body);

    // Fetch existing data from JSONbin.io
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': API_KEY,
      },
    });

    let existingData = [];
    if (response.ok) {
      const jsonData = await response.json();
      existingData = jsonData.record.words || [];
    } else {
      // If the bin doesn't exist or there's an error, initialize with an empty array
      existingData = [];
    }

    // Combine existing usernames with new shown usernames, removing duplicates
    const allUsrnames = Array.from(new Set([...existingData, ...shownUsrnames]));

    // Check if all usernames have been shown
    if (allUsrnames.length === 3) { // Replace 3 with the actual number of usernames in your XML file
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'All usernames have been shown' }),
      };
    }

    // Update the data in JSONbin.io
    const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY,
      },
      body: JSON.stringify({ words: allUsrnames }),
    });

    if (!updateResponse.ok) {
      throw new Error(`JSONbin.io request failed with status ${updateResponse.status}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Shown usernames saved successfully' }),
    };

  } catch (error) {
    console.error('Error in function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save shown usernames' }),
    };
  }
};