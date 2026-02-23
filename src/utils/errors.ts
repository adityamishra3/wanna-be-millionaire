export class AppError extends Error {
    statusCode: number

    constructor(message: string, statusCode: number){
        super(message)
        this.statusCode = statusCode
        this.name = 'AppError'
    }
}

export class NotFoundError extends AppError {
    constructor(message: string){
        super(message, 404)
        this.name = 'NotFoundError'  // override parent's name
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string){
        super(message, 401)
        this.name = 'UnauthorizedError'
    }
}

export class ForbiddenError extends AppError {
    constructor(message:string){
        super(message, 403)
        this.name = 'ForbiddenError'
    }
}