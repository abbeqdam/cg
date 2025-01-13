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
    // Display the message without the #word-container
    const messageElement = document.createElement('p');
    messageElement.textContent = "You have already generated all credentials.";
    messageElement.style.fontFamily = 'Arial, sans-serif';
    messageElement.style.fontSize = '1.2rem';
    messageElement.style.fontWeight = 'bold';
    document.body.appendChild(messageElement);
    return;
  }

  fetch('usrname.xml')
    .then(response => response.text())
    .then(xmlString => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");

      const usrnameElements = xmlDoc.getElementsByTagName("usrname");
      const usrnames = [];
      for (let i = 0; i < usrnameElements.length; i++) {
        const usrname = usrnameElements[i].getElementsByTagName("name")[0].textContent;
        const password = usrnameElements[i].getElementsByTagName("password")[0].textContent;
        usrnames.push({ name: usrname, password: password });
      }

      const availableUsrnames = usrnames.filter(usrname => !shownUsrnames.includes(usrname.name));

      if (availableUsrnames.length === 0) {
        // Display the message without the #word-container
        const messageElement = document.createElement('p');
        messageElement.textContent = "No more usernames!";
        messageElement.style.fontFamily = 'Arial, sans-serif';
        messageElement.style.fontSize = '1.2rem';
        messageElement.style.fontWeight = 'bold';
        document.body.appendChild(messageElement);

        credentialsGenerated = true;
        return;
      }

      const randomIndex = Math.floor(Math.random() * availableUsrnames.length);
      const selectedUsrname = availableUsrnames[randomIndex];

      document.getElementById("usrname").textContent = selectedUsrname.name;

      const passwordElement = document.querySelector('.password');
      passwordElement.textContent = selectedUsrname.password;

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