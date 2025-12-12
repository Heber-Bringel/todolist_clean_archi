import type { Category } from "../../../domain/entities/Category.js";
import type { Task } from "../../../domain/entities/Task.js";
import type { ITaskRepository } from "../../../domain/repositories/ITaskRepository.js";
import { v4 as uuid } from "uuid";

export class TaskMemoryRepository implements ITaskRepository {
    private tasks: Task[] = [];

    public async create(data: Task): Promise<Task> {

        this.tasks.push(data);
        return data;
    }

    public async findAll(): Promise<Task[]> {
        return this.tasks;
    }

    public async findById(id: string): Promise<Task | undefined> {
       return this.tasks.find((task: Task) => task.id === id);
    }

    public async findByCategory(category: Category): Promise<Task[]> {
        return this.tasks.filter((task: Task) => task.category === category);
    }

    public async findByTitle(title: string): Promise<Task | undefined> {
        return this.tasks.find((task: Task) => task.title == title);
    }

    public async update(id: string, data: Partial<Task>): Promise<Task> {
        const index = this.tasks.findIndex((task: Task) => task.id === id);
        if (index === -1) throw new Error("Task not found");

        const currentTask = this.tasks[index]!;
        
        const updatedTask: Task = {
            ...currentTask,
            ...data,
            id: currentTask.id,
            createAt: currentTask.createAt
        };

        this.tasks[index] = updatedTask;

        return updatedTask;
    }

    public async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}