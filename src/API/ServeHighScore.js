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

async function sortScores(arr) {
  const data = await arr.sort((a, b) => b.score - a.score);
  return data;
}

async function renderScores() {
  const scores = await getScores();
  const sortedScores = await sortScores(scores);

  const table = document.getElementById('table');
  for (let i = 0; i < 10; i += 1) {
    const { user } = sortedScores[i];
    const { score } = sortedScores[i];
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

export { renderScores, getScores };
