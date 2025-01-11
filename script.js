let shownUsrnames = [];

// Load shown usernames from localStorage
function loadShownUsrnames() {
  const storedUsrnames = localStorage.getItem('shownUsrnames');
  if (storedUsrnames) {
    shownUsrnames = JSON.parse(storedUsrnames);
  }
}

// Call loadShownUsrnames() on page load
loadShownUsrnames();

function showWord() {
  fetch('usrname.xml')
    .then(response => response.text())
    .then(xmlString => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      const usrnames = Array.from(xmlDoc.getElementsByTagName("usrname")).map(usrname => usrname.textContent);

      const availableUsrnames = usrnames.filter(usrname => !shownUsrnames.includes(usrname));

      if (availableUsrnames.length === 0) {
        document.getElementById("word").textContent = "No more usernames!";
        return;
      }

      const randomIndex = Math.floor(Math.random() * availableUsrnames.length);
      const selectedUsrname = availableUsrnames[randomIndex];

      document.getElementById("word").textContent = selectedUsrname;

      const passwordElement = document.querySelector('.password');
      passwordElement.textContent = "12345678";

      shownUsrnames.push(selectedUsrname);

      // Save shown usernames to JSON file
      try {
        const jsonData = JSON.stringify(shownUsrnames);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'shown_usrnames.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error saving shown usernames:', error);
      }
    });

  document.getElementById('show-word-button').style.display = 'none';
  document.getElementById('word-container').style.display = 'block';
}

function copyUsername() {
  const username = document.getElementById("word").textContent;
  navigator.clipboard.writeText(username);
}

function copyPassword() {
  navigator.clipboard.writeText("12345678");
}

document.getElementById('show-word-button').addEventListener('click', showWord);