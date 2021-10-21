import 'dotenv/config';
import express from 'express';

import { router } from './routes';

const app = express();
app.use(express.json())

app.use(router);

app.listen(4000,() => console.log(':rocketseat - Server is running on PORT 4000')) 
// porta que a minha aplicação vai rodar, o console é so pra saber que a aplicação esta rodando


// criação da Rota do github
  app.get('/github', (request, response) => {
    response.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
  }); // aplicação sera redirecionada
  //para eu usar o process.env é necessario instalar uma dependencia - "npm i dotenv" para minha aplicação conseguir ter acesso as minhas variaveis

// 1 - No browser de um "localhost/4000/github"
// 2 - Authorize sua conta
// 3 - Vai me devolver isso "/signin/callback"
// 4 - Execute as linhas de baixo

app.get('/signin/callback', (request, response) => {
  const { code } = request.query;

  return response.json(code);
});

// 5- localhost/4000/github novamente e me retornara um id/autenticação que o proprio github fornece

//OBS: consigo ver quantos usuarios foram se autenticando na minha aplicação la na pagina go git hub no meu NLW HEAT NODE "https://github.com/settings/developers"

