// script.js

let shownUsrnames = [];
let credentialsGenerated = false;

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
    if (shownUsrnames.length === 3) {
      credentialsGenerated = true;
    }
  })
  .catch(error => {
    console.error('Error fetching shown usernames:', error);
  });

function showWord() {
    // Fetch usernames from XML file
/*   if (credentialsGenerated) {
    document.getElementById("usrname").textContent = "You have already generated all credentials."; // Changed "word" to "usrname"
    document.getElementById('word-container').style.display = 'block';
    return;
  } */

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
        document.getElementById("usrname").textContent = "No more usernames!";
        const passwordElement = document.querySelector('.password');
        passwordElement.textContent = ""
        //credentialsGenerated = true;
        return;
      }

            // Select a random username
      const randomIndex = Math.floor(Math.random() * availableUsrnames.length);
      const selectedUsrname = availableUsrnames[randomIndex];

      // Display the username
      document.getElementById("usrname").textContent = selectedUsrname; // Changed "word" to "usrname"

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

        if (shownUsrnames.length === 3) {
          credentialsGenerated = true;
        }
      })
      .catch(error => {
        console.error('Error saving shown usernames:', error);
      });
    });

  document.getElementById('show-word-button').style.display = 'none';
  document.getElementById('word-container').style.display = 'block';
}

function copyUsername() {
  const username = document.getElementById("usrname").textContent; // Changed "word" to "usrname"
  navigator.clipboard.writeText(username);
}

function copyPassword() {
  navigator.clipboard.writeText("12345678");
}

document.getElementById('show-word-button').addEventListener('click', showWord);