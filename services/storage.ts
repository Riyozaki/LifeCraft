import { User } from "../types";

const STORAGE_KEY = 'lifecraft_user_v1';

export const saveUser = (user: User) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Failed to save progress", e);
  }
};

export const loadUser = (): User | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const clearUser = () => {
  localStorage.removeItem(STORAGE_KEY);
};