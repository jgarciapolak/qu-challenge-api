const express = require('express');
const cors = require('cors');
const LimitingMiddleware = require('limiting-middleware');
const { randomJoke, randomTen, randomSelect, jokeByType, jokeById, getJokes, addJoke, removeJokeById, addRatingToJokeById } = require('./handler');

const app = express();

app.use(new LimitingMiddleware().limitByIp());
app.use(cors());
app.use(express.json()); 

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  res.send('Try /random_joke, /random_ten, /jokes/random, or /jokes/ten');
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/random_joke', (req, res) => {
  res.json(randomJoke());
});

app.get('/random_ten', (req, res) => {
  res.json(randomTen());
});

app.get('/random_n/:number', (req, res) => {
  res.json(randomSelect(req.params.number));
});

app.get('/jokes/random', (req, res) => {
  res.json(randomJoke());
});

app.get("/jokes/random(/*)?", (req, res) => {
  let num;
  const jokes = getJokes();
  try {
    num = parseInt(req.path.substring(14, req.path.length));
  } catch (err) {
    res.send("The passed path is not a number.");
  } finally {
    const count = Object.keys(jokes).length;

    if (num > Object.keys(jokes).length) {
      res.send(`The passed path exceeds the number of jokes (${count}).`);
    } else {
      res.json(randomSelect(num));
    }
  }
});

app.get('/jokes/ten', (req, res) => {
  res.json(randomTen());
});

app.get('/jokes/:type/random', (req, res) => {
  res.json(jokeByType(req.params.type, 1));
});

app.get('/jokes/:type/ten', (req, res) => {
  res.json(jokeByType(req.params.type, 10));
});

app.get('/jokes/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const joke = jokeById(+id);
    if (!joke) return next({ statusCode: 404, message: 'joke not found' });
    return res.json(joke);
  } catch (e) {
    return next(e);
  }
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    type: 'error', message: err.message
  });
});

app.get('/jokes', (req, res, next) => {
  res.json(getJokes());
});

app.post('/jokes', (req, res) => {
  let newJoke = req.body;
  newJoke = addJoke(newJoke);
  res.send(newJoke);
});

app.delete('/jokes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  removeJokeById(id);
  res.send('Joke removed successfully');
});

app.post('/jokes/:id/rating', (req, res, next) => {
  const id = parseInt(req.params.id);
  const rating = parseInt(req.body.rating);

  const joke = addRatingToJokeById(id, rating);
  if (!joke) return next({ statusCode: 404, message: 'joke not found' });

  res.send('Joke rating updated successfully');
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
