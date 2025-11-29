import Fastify from "fastify";
import cors from "@fastify/cors";
import { routes } from './routes';

const app = Fastify({ 
    logger: true,
    // Aumentando para 50MB para garantir que nenhuma foto trave
    bodyLimit: 50 * 1024 * 1024 
})

// Tratamento de erro
app.setErrorHandler((error, request, reply) => {
    console.error(error);
    reply.code(500).send({ message: error.message });
})

const start = async () => {
    // --- CONFIGURAÇÃO DO CORS MAIS PERMISSIVA ---
    await app.register(cors, { 
        origin: true, // Permite todas as origens (localhost, etc)
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Libera o PUT explicitamente
        allowedHeaders: ['Content-Type', 'Authorization'], // Libera cabeçalhos de arquivo
        credentials: true
    });

    await app.register(routes);
    
    try{
        // host: '0.0.0.0' ajuda a evitar erros de rede no Windows/WSL
        await app.listen({ port: 3333, host: '0.0.0.0' }) 
    }catch(err){
        process.exit(1)
    }
}

start();