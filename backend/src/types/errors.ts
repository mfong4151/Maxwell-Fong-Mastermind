import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientRustPanicError } from "@prisma/client/runtime/library"

export type prismaError = PrismaClientKnownRequestError | PrismaClientRustPanicError | PrismaClientInitializationError;

export type controllerError = unknown | prismaError; 