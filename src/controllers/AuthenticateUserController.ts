import { Request, Response } from 'express';
import { AuthenticateUserService } from '../services/AuthenticateUserService';


class AuthenticateUserController {
  //Le: request vai ser do tipo request e response vai ser do tipo Response 
  async handle(request: Request, response: Response) {
    const { code } = request.body;

    const service = new AuthenticateUserService();

    try {
      const result = await service.execute(code); //ele esta esperando uma string, se eu passar um numero dara erro
      return response.json(result);
    } catch (error) {
      return response.json({ error: error.message });
    }
  }
}

export { AuthenticateUserController };