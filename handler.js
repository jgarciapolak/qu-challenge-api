const jokes = require('./jokes/index.json');

let lastJokeId = 0;
jokes.forEach(jk => jk.id = ++lastJokeId);

const randomJoke = () => {
  return jokes[Math.floor(Math.random() * jokes.length)];
}

/**
 * Get N random jokes from a jokeArray
 */
const randomN = (jokeArray, n) => {
  const limit = jokeArray.length < n ? jokeArray.length : n;
  const randomIndicesSet = new Set();

  while (randomIndicesSet.size < limit) {
    const randomIndex = Math.floor(Math.random() * jokeArray.length);
    if (!randomIndicesSet.has(randomIndex)) {
      randomIndicesSet.add(randomIndex);
    }
  }

  return Array.from(randomIndicesSet).map(randomIndex => {
    return jokeArray[randomIndex];
  });
};

const randomTen = () => randomN(jokes, 10);

const randomSelect = (number) => randomN(jokes, number);

const jokeByType = (type, n) => {
  return randomN(jokes.filter(joke => joke.type === type), n);
};

/** 
 * @param {Number} id - joke id
 * @returns a single joke object or undefined
 */
const jokeById = (id) => (jokes.filter(jk => jk.id === id)[0]);


/**
 * get jokes
 */
const getJokes = () => {
  return jokes
};

/**
 * add a joke
 */
const addJoke = (newJoke) => {
  newJoke.id = ++lastJokeId;
  jokes.push(newJoke);
  return newJoke
};

/**
 * remove a joke by id
 */
const removeJokeById = (id) => {
  const index = jokes.findIndex(joke => joke.id === id);
  if (index !== -1) {
    jokes.splice(index, 1);
  }
};

/**
 * rate a joke by id
 */
const addRatingToJokeById = (id, rating) => {
  const joke = jokes.find(joke => joke.id === id);
  if(!joke){
    return null;
  }
  if(!joke.rating){
    joke.rating = 0;
  }
  joke.rating = +parseInt(rating);
  return joke;
};

module.exports = { jokes, randomJoke, randomN, randomTen, randomSelect, jokeById, jokeByType, getJokes, addJoke, removeJokeById, addRatingToJokeById };