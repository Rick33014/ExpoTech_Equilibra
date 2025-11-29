import prismaClient from "../prisma";

// 1. Adicionamos a senha na Interface (o "contrato" do que deve ser enviado)
interface CreateCustomerProps {
    name: string;
    email: string;
    password: string;  // <--- Adicionei aqui
}

class CreateCustomerService {
    // 2. Recebemos a password aqui nos parâmetros
    async execute({ name, email, password }: CreateCustomerProps) {

        // 3. Verificamos se a senha foi enviada
        if (!name || !email || !password) {
            throw new Error("Preencha todos os campos");
        }

        const customer = await prismaClient.customer.create({
            data: {
                name,
                email,
                password, // 4. Salvamos no banco
                status: true
            }
        })

        return customer;
    }
}

export { CreateCustomerService }