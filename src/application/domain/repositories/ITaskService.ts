import type { Category } from "../entity/Category.js";
import type { Task } from "../entity/Task.js";

export interface ITaskService {
    findAll(): Promise<Task[]>;
    findById(id: string): Promise<Task>;
    findByCategory(category: Category): Promise<Task>;
    update(id: string, data: Omit<Task, "id" | "createAt">): Promise<Task>;
    delete(id: string): Promise<void>;
}