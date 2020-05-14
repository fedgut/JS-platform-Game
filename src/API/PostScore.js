const key = '1caonueBC9pjahHnAHjK';
// eslint-disable-next-line no-unused-vars
const url = `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${key}/scores/`;

export default async function getScores() {
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
    return response;
  } catch (e) {
    return e;
  }
}
