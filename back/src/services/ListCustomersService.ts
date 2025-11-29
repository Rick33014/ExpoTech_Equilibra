import prismaClient from "../prisma";

class ListCustomersService {
  async execute() {
    // Busca todos os clientes no banco
    const customers = await prismaClient.customer.findMany();

    return customers;
  }
}

// O ERRO PROVAVELMENTE ESTAVA AQUI (Faltou exportar ou estava diferente)
export { ListCustomersService }