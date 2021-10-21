// faz coneção com o meu banco de dados
import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

export default prismaClient;