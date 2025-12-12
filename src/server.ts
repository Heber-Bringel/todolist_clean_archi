import express from "express";

import { TaskMemoryRepository } from "./infra/repositories/memory/TaskMemoryRepository.js";
import { TaskService } from "./application/services/TaskService.js";
import { TaskController } from "./presentation/http/controllers/TaskController.js";
import { createTasksRouter } from "./presentation/http/routes/tasks.routes.js";

console.log("Starting Inversion of Control");

const taskRepository = new TaskMemoryRepository();

// 2. APLICAÇÃO: Instancia o Caso de Uso, injetando o Repositório (Porta)
const taskService = new TaskService(taskRepository);

// 3. APRESENTAÇÃO: Instancia o Controlador, injetando o Caso de Uso
const taskController = new TaskController(taskService);

// --- Inicialização do Servidor Express ---

const app = express();
app.use(express.json()); // Middleware para ler JSON no corpo da requisição

// Conecta o Roteador Express, injetando o Controlador
// Todas as rotas (POST, GET, PUT, DELETE) para Task estarão sob '/tasks'
app.use('/tasks', createTasksRouter(taskController));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server Express is running in port ${PORT}`);
    console.log(`http://localhost:${PORT}/tasks`);
});