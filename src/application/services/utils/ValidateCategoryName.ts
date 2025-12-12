import { Category } from "../../../domain/entities/Category.js";
export const validateCategory = (category: string) => {
    // Verifica se a string fornecida está entre os valores válidos do Enum
    if (!Object.values(Category).includes(category as Category)) {
        throw new Error("Invalid category provided. Category must be one of: " + Object.values(Category).join(', '));
    }
}