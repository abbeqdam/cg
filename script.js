// script.js

let shownUsrnames = [];

// Load shown usernames from the server
fetch('/.netlify/functions/get-shown-usrnames')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    shownUsrnames = data;
  })
  .catch(error => {
    console.error('Error fetching shown usernames:', error);
  });

function showWord() {
  // Fetch usernames from XML file
  fetch('usrname.xml')
    .then(response => response.text())
    .then(xmlString => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      const usrnames = Array.from(xmlDoc.getElementsByTagName("usrname")).map(usrname => usrname.textContent);

      // Filter out shown usernames
      const availableUsrnames = usrnames.filter(usrname => !shownUsrnames.includes(usrname));

      // If all usernames have been shown, display "No more usernames"
      if (availableUsrnames.length === 0) {
        document.getElementById("word").textContent = "No usernames available!";
        document.getElementById("password").textContent = "No  passwords available!";
        return; // Exit the function
      }

      // Select a random username
      const randomIndex = Math.floor(Math.random() * availableUsrnames.length);
      const selectedUsrname = availableUsrnames[randomIndex];

      // Display the username
      document.getElementById("word").textContent = selectedUsrname;

      // Set the password text content
      const passwordElement = document.querySelector('.password');
      passwordElement.textContent = "";

      // Add the username to shownUsrnames
      shownUsrnames.push(selectedUsrname);

      // Send the updated shownUsrnames to the server
      fetch('/.netlify/functions/save-shown-usrnames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shownUsrnames),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        console.log('Shown usernames saved successfully');
      })
      .catch(error => {
        console.error('Error saving shown usernames:', error);
      });
    });

  // Hide the "Generate Credentials" button
  document.getElementById('show-word-button').style.display = 'none';

  // Show the word container
  document.getElementById('word-container').style.display = 'block';
}

function copyUsername() {
  // Copy the username to clipboard
  const username = document.getElementById("word").textContent;
  navigator.clipboard.writeText(username);
}

function copyPassword() {
  // Copy the password to clipboard
  navigator.clipboard.writeText("12345678"); 
}

// Add an event listener to the button
document.getElementById('show-word-button').addEventListener('click', showWord);