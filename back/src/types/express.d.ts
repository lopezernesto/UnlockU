import { Usuario } from "@prisma/client";

declare global {
  namespace Express {
    interface User extends Omit<Usuario, "googleId" | "creadoEn"> {}
  }
}

export {};
