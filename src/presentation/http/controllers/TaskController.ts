import type { Request, Response } from "express"
import { Category } from "../../../domain/entities/Category.js";
import { TaskService } from "../../../application/services/TaskService.js";

export class TaskController {
    constructor(private taskService: TaskService) { }

    public async create(req: Request, res: Response): Promise<Response> {
        try {
            // Adaptar e chamar o Caso de Uso
            const task = await this.taskService.createTask(req.body);
            return res.status(201).json(task);
        } catch (error: any) {
            // Lidar com erros de negócio
            return res.status(400).json({ message: error.message });
        }
    }

    public async listAll(req: Request, res: Response): Promise<Response> {
        try {
            const tasks = await this.taskService.listAllTasks();
            return res.status(200).json(tasks);
        } catch (error: any) {
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }

    public async listById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const task = await this.taskService.listById(id!);
            return res.status(200).json(task);
        } catch (error: any) {
            if (error.message.includes("Task not found")) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    public async listByCategory(req: Request, res: Response) {
        const categoryName = req.params.category;

        // Adicionar uma validação de categoria simples aqui é útil - O controller pode rejeitar formatos inválidos
        if (!Object.values(Category).includes(categoryName as Category)) {
            return res.status(400).json({ message: "Invalid category format." });
        }

        try {
            const tasks = await this.taskService.listByCategory(categoryName as Category);
            return res.status(200).json(tasks);
        } catch (error: any) {
            if (error.message.includes("not found")) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    public async listByTitle(req: Request, res: Response): Promise<Response> {
        try {
            const title = req.params.title;
            const task = await this.taskService.listByTitle(title!);
            return res.status(200).json(task);
        } catch (error: any) {
            if (error.message.includes("Task not found")) {
                // Se o service lançar "not found", mapeia para 404
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    public async update(req: Request, res: Response): Promise<Response> {
        try {
            const id = req.params.id;
            const updatedTask = await this.taskService.updateTask(id!, req.body);
            return res.status(200).json(updatedTask);
        } catch (error: any) {
            if (error.message.includes("not found")) {
                return res.status(404).json({ message: error.message });
            }
            // Erros de validação (título, status, categoria)
            if (error.message.includes("required") || error.message.includes("exists") || error.message.includes("Invalid")) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    public async delete(req: Request, res: Response): Promise<Response> {

        try {
            const id = req.params.id;
            await this.taskService.deleteTask(id!);
            // Sucesso na deleção: 204 No Content
            return res.status(204).send();
        } catch (error: any) {
            if (error.message.includes("not found")) {
                return res.status(404).json({ message: error.message });
            }
            // Erro de regra de negócio (Cannot delete completed tasks)
            if (error.message.includes("Cannot delete")) {
                return res.status(403).json({ message: error.message }); // 403 Forbidden
            }
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}