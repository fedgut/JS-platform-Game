async function getScores() {
  try {
    const response = await fetch(
      'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/1caonueBC9pjahHnAHjK/scores/',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const obj = await response.json();
    const arr = await obj.result;
    return arr;
  } catch (e) {
    return e;
  }
}

async function renderScores(data) {
  const table = document.getElementById('table');
  for (let i = 0; i < 10; i += 1) {
    const { user } = data[i];
    const { score } = data[i];
    const tr = document.createElement('tr');
    const userCell = document.createElement('td');
    const scoreCell = document.createElement('td');
    userCell.textContent = user;
    scoreCell.textContent = score;
    tr.appendChild(userCell);
    tr.appendChild(scoreCell);
    table.appendChild(tr);
  }
}

async function whatevs() {
  const data = await getScores();
  return data;
}

whatevs();
