const express = require('express');
const app = express();
const axios = require('axios');
const YAML = require('yamljs');
const path = require('path');
const PORT = 3000;

app.use(express.json());

app.get('/api-docs', (req, res) => {
  const openApiSpec = YAML.load(path.join(__dirname, 'openapi-spec.yaml'));
  res.json(openApiSpec);
});

app.get('/redoc', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>ReDoc</title>
        <!-- needed for adaptive design -->
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">

        <!--
        ReDoc doesn't change outer page styles
        -->
        <style>
          body {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <redoc spec-url='/api-docs'></redoc>
        <script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"> </script>
      </body>
    </html>
  `);
});


app.get('/players', async (req, res) => {
  try {
    const response = await axios.get('https://mipa-lfcapi.azurewebsites.net/players');
    const players = response.data;
    res.json(players);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error retrieving players' });
  }
});

app.get('/players/:id', async (req, res) => {
  const playerId = Number(req.params.id);
  try {
    const response = await axios.get(`https://mipa-lfcapi.azurewebsites.net/$player{Id}`); 
    const player = response.data;
    res.json(player);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: 'Player not found' });
  }
});

app.post('/players', async (req, res) => {
  const player = req.body;
  try {
    const response = await axios.post('https://mipa-lfcapi.azurewebsites.net/players', player);
    res.sendStatus(response.status);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error creating player' });
  }
});

app.put('/players/:id', async (req, res) => {
  const playerId = Number(req.params.id);
  const updatedPlayer = req.body;
  try {
    const response = await axios.put(`https://mipa-lfcapi.azurewebsites.net/players/${playerId}`, updatedPlayer);
    res.sendStatus(response.status);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: 'Player not found' });
  }
});

app.delete('/players/:id', async (req, res) => {
  const playerId = Number(req.params.id);
  try {
    const response = await axios.delete(`https://mipa-lfcapi.azurewebsites.net/players/${playerId}`);
    res.sendStatus(response.status);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: 'Player not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Express API is listening on port ${PORT}`);
});