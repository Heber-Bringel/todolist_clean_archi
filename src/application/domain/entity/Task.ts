import type { Category } from "./Category.js";

export type Task = {
    title: string;
    description: string;
    category: Category;
    status: string;
    createAt: string;
}