/* eslint-disable no-unused-expressions */

import getScores from '../src/API/ServeHighScore';

// eslint-disable-next-line no-unused-vars
const regeneratorRuntime = require('regenerator-runtime');

const responeJSON = {
  result: [
    {
      user: 'John Doe',
      score: 42,
    },
    {
      user: 'Peter Parker',
      score: 35,
    },
    {
      user: 'Wonder Woman',
      score: 50,
    },
  ],
};

it('returns the correct object', () => {
  fetch.mockResponse(responeJSON);

  async () => {
    const x = await getScores();
    expect(x).toEqual(responeJSON.result);
  };
});
