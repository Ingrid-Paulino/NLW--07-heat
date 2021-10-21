// No cervice colocamos todos os arquivos de regra de negocios
import axios from 'axios';
import { sign } from 'jsonwebtoken';
import prismaClient from "../prisma" //estou inportando de dentro do index

/** // fluxo
 * 1- Receber code(string)
 * 2- Recuperar o access_token no github
 * 3- Recuperar infos do user no github
 * 4- Verificar se o usuario existe no DB
 * se SIM = Gera um token pra ele
 * se NÃO = Cria no DB, gera um token
 * 5- Por fim Retornar o token com as informaçoes do usuario 
*/

interface IAccessTokenResponse {
  access_token: string
}

interface IUserResponse {
  avatar_url: string
  login: string
  id: number
  name?: string
}

//criaçaõ de autenticação do usuario recebendo o codigo que o proprio github fornece
class AuthenticateUserService {
    //code - se eu colocar qualquer informação que não seja uma string dara erro na aplicação
    async execute(code: string) {
      const url = 'https://github.com/login/oauth/access_token';
  
      const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: 'application/json',
        },
  
      });

      const response = await axios.get<IUserResponse>('https://api.github.com/user', {
        headers: {
          authorization: `Bearer ${accessTokenResponse.access_token}`,
        },
      });
  
    const {
      login, id, avatar_url, name,
    } = response.data;

    //olha se existe akgum usuario que é igual ao id
    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id,
      },
    });

    //se usuario n existir eu crio ele
    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          name,
          avatar_url,
        },
      });
    }

    const token = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id,
        },
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: '1d',
      },
    );

    return { token, user };
  }
}

export { AuthenticateUserService };