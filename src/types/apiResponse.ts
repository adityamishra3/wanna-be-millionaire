interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
    module?: string
}

export type {ApiResponse}