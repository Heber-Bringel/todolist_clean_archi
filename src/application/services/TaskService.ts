import { Category } from "../domain/entity/Category.js";
import { v4 as uuid } from "uuid";
import type { Task } from "../domain/entity/Task.js";
import type { ITaskService } from "../domain/repositories/ITaskService.js";

export class TaskService {
    constructor(private TaskService: ITaskService) { }

    public async createTask(data: Omit<Task, "id" | "createAt" | "status">) {
        const title = data.title.trim();
        const exist = await this.TaskService.findByTitle(title);

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

        return this.TaskService.create(task);
    }

    public async listAllTasks(): Promise<Task[]> {
        return await this.TaskService.findAll();
    }

    public async listById(id: string): Promise<Task> {
        const task = await this.TaskService.findById(id);
        if (!task) {
            throw new Error("Task not found.");
        }

        return task;
    }

    public async listByCategory(category: Category): Promise<Task[]> {
        const tasks = await this.TaskService.findByCategory(category);
        if (!tasks) {
            throw new Error("Tasks not found.");
        }
        return tasks;
    }

    public async listByTitle(title: string): Promise<Task> {
        const taskWithTitle = await this.TaskService.findByTitle(title);
        if (!taskWithTitle) {
            throw new Error("Task not found.");
        }
        return taskWithTitle;
    }

    public async updateTask(id: string, data: { title?: string, description?: string, category?: Category, status?: Task["status"] }): Promise<Task> {
        const task = await this.TaskService.findById(id);
        if (!task) throw new Error("Task not found.");

        // === Atualizar título ===
        if (data.title !== undefined) {
            const title = data.title.trim();
            if (!title) throw new Error("Title is required.");

            const existing = await this.TaskService.findByTitle(title);
            if (existing && existing.id !== id) {
                throw new Error("Title already exists.");
            }

            task.title = title;
        }

        // === Atualizar descrição ===
        if (data.description !== undefined) {
            task.description = data.description;
        }

        // === Atualizar categoria ===
        if (data.category !== undefined) {
            if (!Object.values(Category).includes(data.category)) {
                throw new Error("Invalid category.");
            }
            task.category = data.category;
        }

        // === Atualizar status ===
        if (data.status !== undefined) {
            const valid = ["PENDENTE", "CONCLUIDA", "EM_ANDAMENTO"];
            if (!valid.includes(data.status)) throw new Error("Invalid status.");
            task.status = data.status;
        }

        return await this.TaskService.update(id, task);
    }

    public async deleteTask(id: string): Promise<void> {
        const task = await this.TaskService.findById(id);
        if (!task) {
            throw new Error("Task not found.");
        }

        if (task.status === "CONCLUIDA") {
            throw new Error("Cannot delete completed tasks.");
        }

        await this.TaskService.delete(id);
    }
}