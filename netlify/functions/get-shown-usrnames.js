const fs = require('fs');

exports.handler = async function (event, context) {
  try {
    const data = fs.readFileSync('shown_usrnames.json', 'utf8');
    const shownUsrnames = JSON.parse(data);
    return {
      statusCode: 200,
      body: JSON.stringify(shownUsrnames),
    };
  } catch (error) {
    // If the file doesn't exist or there's an error, return an empty array
    return {
      statusCode: 200,
      body: JSON.stringify([]),
    };
  }
};