import { ValidationError } from "../../utils/ValidationError";

export const validateNameUpdate = (name: string): void => {
    const trimmedName = name.trim();

    if(trimmedName === "") {
        throw new ValidationError('Name cannot be empty or only spaces')
    }
}