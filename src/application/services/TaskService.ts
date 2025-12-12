import { Category } from "../../domain/entities/Category.js";
import { v4 as uuid } from "uuid";
import type { Task } from "../../domain/entities/Task.js";
import type { ITaskRepository } from "../../domain/repositories/ITaskRepository.js";

export class TaskService {
    constructor(private TaskRepository: ITaskRepository) { }

    public async createTask(data: Omit<Task, "id" | "createAt" | "status">) {
        const title = data.title.trim();
        const exist = await this.TaskRepository.findByTitle(title);

        if (!title) {
            throw new Error("Title is required.");
        }

        if (exist) {
            throw new Error("Invalid task title.");
        }

        const task: Task = {
            id: uuid(),
            title: data.title,
            description: data.description,
            category: data.category,
            status: "PENDENTE",
            createAt: new Date()
        }

        return this.TaskRepository.create(task);
    }

    public async listAllTasks(): Promise<Task[]> {
        return await this.TaskRepository.findAll();
    }

    public async listById(id: string): Promise<Task> {
        const task = await this.TaskRepository.findById(id);
        if (!task) {
            throw new Error("Task not found.");
        }

        return task;
    }

    public async listByCategory(category: Category): Promise<Task[]> {
        const tasks = await this.TaskRepository.findByCategory(category);
        if (!tasks) {
            throw new Error("Tasks not found.");
        }
        return tasks;
    }

    public async listByTitle(title: string): Promise<Task> {
        const taskWithTitle = await this.TaskRepository.findByTitle(title);
        if (!taskWithTitle) {
            throw new Error("Task not found.");
        }
        return taskWithTitle;
    }

    public async updateTask(id: string, data: { title?: string, description?: string, category?: Category, status?: Task["status"] }): Promise<Task> {
        // 1. Busca a tarefa existente (necessário para validações de negócio)
        const existingTask = await this.TaskRepository.findById(id);
        if (!existingTask) throw new Error("Task not found.");

        // 2. CRIA o objeto que conterá APENAS as alterações (Partial<Task>)
        const updates: Partial<Task> = {};

        // === Atualizar título (com regras de negócio) ===
        if (data.title !== undefined) {
            const title = data.title.trim();
            if (!title) throw new Error("Title is required.");

            // Validação de unicidade de título, excluindo a tarefa atual
            const existingWithTitle = await this.TaskRepository.findByTitle(title);
            if (existingWithTitle && existingWithTitle.id !== id) {
                throw new Error("Title already exists.");
            }

            // Se a validação passou, adiciona a alteração ao objeto 'updates'
            updates.title = title;
        }

        // === Atualizar descrição (sem regras complexas) ===
        if (data.description !== undefined) {
            updates.description = data.description;
        }

        // === Atualizar categoria (com regras de negócio) ===
        
            // Assumindo que Category é um enum/objeto que contém os valores válidos
            if (!Object.values(Category).includes(data.category as Category)) {
                throw new Error("Invalid category.");
            }
            updates.category = data.category!;
        

        // === Atualizar status (com regras de negócio) ===
        if (data.status !== undefined) {
            const validStatuses = ["PENDENTE", "CONCLUIDA", "EM_ANDAMENTO"];
            if (!validStatuses.includes(data.status)) throw new Error("Invalid status.");
            updates.status = data.status;
        }

        if (Object.keys(updates).length === 0) {
            return existingTask;
        }

        return await this.TaskRepository.update(id, updates);
    }

    public async deleteTask(id: string): Promise<void> {
        const task = await this.TaskRepository.findById(id);
        if (!task) {
            throw new Error("Task not found.");
        }

        if (task.status === "CONCLUIDA") {
            throw new Error("Cannot delete completed tasks.");
        }

        await this.TaskRepository.delete(id);
    }
}