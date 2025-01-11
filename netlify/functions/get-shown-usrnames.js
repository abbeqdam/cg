const { Firestore } = require('@google-cloud/firestore');

// Initialize Firestore with your project ID
const firestore = new Firestore({
  projectId: 'intake-447511', // Replace with your actual project ID
});

exports.handler = async function (event, context) {
  try {
    // Fetch the shown usernames from Firestore
    const docRef = firestore.collection('shown-usrnames').doc('data');
    const doc = await docRef.get();

    // If the document exists, return the shownUsrnames array
    if (doc.exists) {
      const shownUsrnames = doc.data().words;
      return {
        statusCode: 200,
        body: JSON.stringify(shownUsrnames),
      };
    } else {
      // If the document doesn't exist, return an empty array
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      };
    }
  } catch (error) {
    console.error('Error fetching shown usernames:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({error: 'Failed to fetch shown usernames'}),
    };
  }
};