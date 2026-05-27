import type { UserDTO } from "~/modules/auth/application/dtos/user.dto";

let currentUser: UserDTO | null = null;

export function setCurrentUser(user: UserDTO): void {
  currentUser = user;
}

export function getCurrentUser(): UserDTO | null {
  return currentUser;
}

export function clearCurrentUser(): void {
  currentUser = null;
}
