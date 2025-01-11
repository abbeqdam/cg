const fs = require('fs');

exports.handler = async function (event, context) {
  try {
    const shownUsrnames = JSON.parse(event.body);
    const data = JSON.stringify(shownUsrnames);
    fs.writeFileSync('shown_usrnames.json', "test", 'utf8');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Shown usernames saved successfully' }),
    };
  } catch (error) {
    console.error('Error saving shown usernames:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save shown usernames' }),
    };
  }
};