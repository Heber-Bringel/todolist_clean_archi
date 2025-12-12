// src/presentation/http/routes/tasks.routes.ts

import { Router } from 'express';
import { TaskController } from '../controllers/TaskController.js'; // Importa o Adaptador/Controller

/**
 * Cria e configura todas as rotas HTTP para a entidade Task.
 * * @param taskController A instância do TaskController, injetada pelo server.ts
 * @returns Um Router do Express com as rotas definidas.
 */
export function createTasksRouter(taskController: TaskController): Router {
    const router = Router();
    
    // Rotas de Criação e Listagem
    // POST /tasks
    router.post('/', (req, res) => taskController.create(req, res));
    
    // GET /tasks
    router.get('/', (req, res) => taskController.listAll(req, res));
    
    // Rotas de Busca por Parâmetro na URL
    // GET /tasks/id/:id
    router.get('/id/:id', (req, res) => taskController.listById(req, res));
    
    // GET /tasks/title/:title
    router.get('/title/:title', (req, res) => taskController.listByTitle(req, res));
    
    // GET /tasks/category/:category
    router.get('/category/:category', (req, res) => taskController.listByCategory(req, res));

    // Rotas de Atualização e Remoção
    // PUT /tasks/:id
    router.put('/:id', (req, res) => taskController.update(req, res));
    
    // DELETE /tasks/:id
    router.delete('/:id', (req, res) => taskController.delete(req, res));

    return router;
}