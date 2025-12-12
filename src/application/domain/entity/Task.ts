import type { Category } from "./Category.js";

export type Task = {
    id: string;
    title: string;
    description: string;
    category: Category;
    status: string;
    createAt: string;
}