import { PrismaClientKnownRequestError, PrismaClientRustPanicError } from "@prisma/client/runtime/library"

export type controllerError = unknown | PrismaClientKnownRequestError | PrismaClientRustPanicError