import fastify, { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify"
import { CreateCustomerController } from "./controllers/CreateCustomerController"
import { ListCustomersController } from "./controllers/ListCustomersController"
import { DeleteCustomerController } from "./controllers/DeleteCustomerController"
import { PrismaClient } from "@prisma/client" 
import nodemailer from "nodemailer"; 


import dialogflow from '@google-cloud/dialogflow';
import path from 'path';
import { spawn } from 'child_process'; 

const prisma = new PrismaClient();


const PROJECT_ID = 'nutribot-lhdm'; 
const SESSION_CLIENT = new dialogflow.SessionsClient({
    keyFilename: path.join(__dirname, '../dialogflow-key.json') 
});

export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {

    
    fastify.get("/teste", async (request: FastifyRequest, reply: FastifyReply) => {
        return { ok: true }
    })

    
    fastify.post("/users", async (request: FastifyRequest, reply: FastifyReply) => {
        return new CreateCustomerController().handle(request, reply)
    })

    
    fastify.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
        const { email, password } = request.body as any;

        const customer = await prisma.customer.findFirst({
            where: { email }
        });

        if (!customer || customer.password !== password) {
            return reply.status(400).send({ message: "Email ou senha incorretos." });
        }

        return reply.send({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            birthDate: customer.birthDate,
            avatarUrl: customer.avatarUrl,
            token: "token-de-acesso-falso-123" 
        });
    })

    
    fastify.post("/forgot-password", async (request: FastifyRequest, reply: FastifyReply) => {
        const { email } = request.body as any;

        const customer = await prisma.customer.findFirst({ where: { email } })

        if (!customer) {
            return reply.send({ message: "Se o e-mail existir, enviamos o link." });
        }

        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, 
            auth: {
                
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS
            }
        });

        try {
            await transport.sendMail({
                from: 'EquiLibra <equilibra.suporte0@gmail.com>',
                to: email, 
                subject: 'Recuperação de Senha - EquiLibra',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border: 1px solid #ddd; border-radius: 10px;">
                        <h1 style="color: #16a34a;">EquiLibra 🌿</h1>
                        <h2>Olá, ${customer.name}!</h2>
                        <p>Clique no botão abaixo para redefinir sua senha:</p>
                        <a href="http:
                    </div>
                `
            });
            return reply.send({ message: "Email enviado com sucesso!" });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ message: "Erro ao enviar e-mail." });
        }
    })

    
    fastify.post("/reset-password", async (request: FastifyRequest, reply: FastifyReply) => {
        const { email, newPassword } = request.body as any;
        try {
            const customer = await prisma.customer.findFirst({ where: { email } });
            if (!customer) return reply.status(404).send({ message: "Usuário não encontrado." });

            await prisma.customer.update({
                where: { id: customer.id },
                data: { password: newPassword }
            });
            return reply.send({ message: "Senha alterada com sucesso!" });
        } catch (error) {
            return reply.status(500).send({ message: "Erro ao atualizar a senha." });
        }
    })

    
    fastify.put("/change-password", async (request: FastifyRequest, reply: FastifyReply) => {
        const { email, currentPassword, newPassword } = request.body as any;
        try {
            const customer = await prisma.customer.findFirst({ where: { email } });
            if (!customer) return reply.status(404).send({ message: "Usuário não encontrado." });
            if (customer.password !== currentPassword) return reply.status(400).send({ message: "A senha atual está incorreta." });

            await prisma.customer.update({
                where: { id: customer.id },
                data: { password: newPassword }
            });
            return reply.send({ message: "Senha alterada com sucesso!" });
        } catch (error) {
            return reply.status(500).send({ message: "Erro ao alterar senha." });
        }
    })

    
    fastify.post("/chat", async (request: FastifyRequest, reply: FastifyReply) => {
        const { message, userId } = request.body as any; 

        const sessionPath = SESSION_CLIENT.projectAgentSessionPath(PROJECT_ID, userId || 'visitante-anonimo');

        const requestDialogflow = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: message,
                    languageCode: 'en', 
                },
            },
        };

        try {
            const responses = await SESSION_CLIENT.detectIntent(requestDialogflow);
            const result = responses[0].queryResult;
            const botReply = result?.fulfillmentText || "Desculpe, não entendi. Pode reformular?";

            return reply.send({ reply: botReply });

        } catch (error) {
            console.error("Erro Dialogflow:", error);
            return reply.status(500).send({ message: "Erro ao conectar com o ChatBot." });
        }
    })

    
    fastify.post("/ai/predict", async (request: FastifyRequest, reply: FastifyReply) => {
        const { weight, height } = request.body as any;

        if (!weight || !height) {
            return reply.status(400).send({ message: "Peso e altura são obrigatórios." });
        }

        const inputData = JSON.stringify({ weight, height });
        const scriptPath = path.join(__dirname, '../../python-ml/predict.py');

        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', [scriptPath, inputData]);

            let resultString = '';

            pythonProcess.stdout.on('data', (data) => {
                resultString += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`Erro no Python: ${data}`);
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error(`Processo Python fechou com código ${code}`);
                    resolve(reply.status(500).send({ message: "Erro ao executar modelo ML." }));
                } else {
                    try {
                        const jsonResult = JSON.parse(resultString);
                        resolve(reply.send(jsonResult));
                    } catch (e) {
                        resolve(reply.status(500).send({ message: "Erro ao processar resposta do Python." }));
                    }
                }
            });
        });
    })

    
    fastify.put("/users/avatar", async (request: FastifyRequest, reply: FastifyReply) => {
        const { email, avatarUrl } = request.body as any;
        try {
            const customer = await prisma.customer.findFirst({ where: { email } });
            if (!customer) return reply.status(404).send({ message: "Usuário não encontrado" });

            const updatedUser = await prisma.customer.update({
                where: { id: customer.id },
                data: { avatarUrl }
            });
            return reply.send({ message: "Foto atualizada!", user: updatedUser });
        } catch (error) {
            return reply.status(500).send({ message: "Erro ao salvar foto." });
        }
    })

    
    fastify.put("/users/profile", async (request: FastifyRequest, reply: FastifyReply) => {
        const { email, name, phone, birthDate } = request.body as any;
        try {
            const customer = await prisma.customer.findFirst({ where: { email } });
            if (!customer) return reply.status(404).send({ message: "Usuário não encontrado" });

            const updatedUser = await prisma.customer.update({
                where: { id: customer.id },
                data: { name, phone, birthDate }
            });
            return reply.send({ message: "Dados atualizados!", user: updatedUser });
        } catch (error) {
            return reply.status(500).send({ message: "Erro ao atualizar perfil." });
        }
    })

    
    fastify.get("/customers", async (request: FastifyRequest, reply: FastifyReply) => {
        return new ListCustomersController().handle(request, reply)
    })

    
    fastify.delete("/customer", async (request: FastifyRequest, reply: FastifyReply) => {
        return new DeleteCustomerController().handle(request, reply)
    })
}