import { isAxiosError } from "axios";
import api from "../config/axios";
import type { User } from "../types";

// Obtener el usuario autenticado
export async function getUser() {
    try {
        const { data } = await api<User>("/user")
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}