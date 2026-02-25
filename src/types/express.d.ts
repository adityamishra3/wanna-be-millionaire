// src/types/express.d.ts
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string,
    exp?:number
  }
}

export {}