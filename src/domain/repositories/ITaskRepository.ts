import type { Category } from "../entities/Category.js";
import type { Task } from "../entities/Task.js";

export interface ITaskRepository {
    create(data: Task): Promise<Task>;
    findAll(): Promise<Task[]>;
    findById(id: string): Promise<Task | undefined>;
    findByCategory(category: Category): Promise<Task[]>;
    findByTitle(title: string): Promise<Task | undefined>;
    update(id: string, data: Partial<Task>): Promise<Task>;
    delete(id: string): Promise<void>;
}