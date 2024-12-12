// pages/api/get-joke.js

import axios from 'axios';

export default async function handler(req, res) {
    try {
      const langs = ['cs', 'de', 'en', 'es', 'fr', 'pt']
      let lang = req.body.context.lang
      if (!langs.includes(lang)) lang = 'en'

      const response = await axios.get(
        `https://v2.jokeapi.dev/joke/Any?lang=${lang}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Retorna o conteúdo da resposta recebida
      res.status(200).json({context: response.data});
    } catch (error) {
      // Em caso de erro, retorna a mensagem de erro
      res.status(500).json({ error: error.message });
    }
}
