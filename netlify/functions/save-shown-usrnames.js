const { Firestore } = require('@google-cloud/firestore');

// Initialize Firestore with your project ID
const firestore = new Firestore({
  projectId: 'intake-447511', // Replace with your actual project ID
});

exports.handler = async function (event, context) {
  try {
    const shownUsrnames = JSON.parse(event.body);

    // Save the shownUsrnames array to Firestore
    const docRef = firestore.collection('shown-usrnames').doc('data');
    await docRef.set({words: shownUsrnames});

    return {
      statusCode: 200,
      body: JSON.stringify({message: 'Shown usernames saved successfully'}),
    };
  } catch (error) {
    console.error('Error saving shown usernames:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({error: 'Failed to save shown usernames'}),
    };
  }
};