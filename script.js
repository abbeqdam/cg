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
  if (credentialsGenerated) {
    document.getElementById("usrname").textContent = "You have already generated all credentials.";
    document.getElementById('word-container').style.display = 'block';
    return;
  }

  fetch('usrname.xml')
    .then(response => response.text())
    .then(xmlString => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");

      // Extract usernames and passwords
      const usrnameElements = xmlDoc.getElementsByTagName("usrname");
      const usrnames = [];
      for (let i = 0; i < usrnameElements.length; i++) {
        const usrname = usrnameElements[i].getElementsByTagName("name")[0].textContent;
        const password = usrnameElements[i].getElementsByTagName("password")[0].textContent;
        usrnames.push({ name: usrname, password: password });
      }

      const availableUsrnames = usrnames.filter(usrname => !shownUsrnames.includes(usrname.name));

      if (availableUsrnames.length === 0) {
        document.getElementById("usrname").textContent = "No more usernames!";
        credentialsGenerated = true;

        // Set the password to blank
        const passwordElement = document.querySelector('.password');
        passwordElement.textContent = "";

        return;
      }

      const randomIndex = Math.floor(Math.random() * availableUsrnames.length);
      const selectedUsrname = availableUsrnames[randomIndex];

      document.getElementById("usrname").textContent = selectedUsrname.name;

      const passwordElement = document.querySelector('.password');

      // Set the password text content (initially hidden with asterisks)
      passwordElement.textContent = "********";

      // Add an event listener to show the actual password on mousedown and hide it on mouseup
      passwordElement.addEventListener('mousedown', () => {
        passwordElement.textContent = selectedUsrname.password; // Show actual password
      });

      passwordElement.addEventListener('mouseup', () => {
        passwordElement.textContent = "********"; // Hide password with asterisks
      });

      shownUsrnames.push(selectedUsrname.name);

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
  const username = document.getElementById("usrname").textContent;
  navigator.clipboard.writeText(username);
}

function copyPassword() {
  const password = document.querySelector('.password').textContent;
  navigator.clipboard.writeText(password);
}

document.getElementById('show-word-button').addEventListener('click', showWord);