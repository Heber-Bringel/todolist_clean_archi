import type { Category } from "../entity/Category.js";
import type { Task } from "../entity/Task.js";

export interface ITaskService {
    create(data: Task): Promise<Task>;
    findAll(): Promise<Task[]>;
    findById(id: string): Promise<Task>;
    findByCategory(category: Category): Promise<Task[]>;
    findByTitle(title: string): Promise<Task>;
    update(id: string, data: Task): Promise<Task>;
    delete(id: string): Promise<void>;
}