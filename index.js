const { create } = require('@wppconnect-team/wppconnect');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const RESPONSES_FILE = path.join(__dirname, 'responses.json');

let responses = {};
function loadResponses() {
  try {
    responses = JSON.parse(fs.readFileSync(RESPONSES_FILE));
  } catch {
    responses = {};
  }
}
loadResponses();

function saveResponses() {
  fs.writeFileSync(RESPONSES_FILE, JSON.stringify(responses, null, 2));
}

create().then((client) => {
  client.onMessage((message) => {
    const msg = message.body.toLowerCase();
    if (responses[msg]) {
      client.sendText(message.from, responses[msg]);
    }
  });

  app.get('/api/responses', (req, res) => {
    loadResponses();
    res.json(responses);
  });

  app.post('/api/responses', (req, res) => {
    responses = req.body;
    saveResponses();
    res.json({ status: 'ok' });
  });

  app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
});