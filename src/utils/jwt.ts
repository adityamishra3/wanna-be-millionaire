import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret'

export const generateToken = async (userId:string): Promise<string|false> => {
    try {
        const token = jwt.sign({userId}, SECRET_KEY, {
            expiresIn: '1Hour'
        });
        if (!token) throw new Error("Error while generating token")
        console.log("Generated token:", token)
        return token
    } catch (error) {
        console.error(error)
        return false
    }
}

export const verifyToken = async (token:string): Promise<string|undefined> => {
    try {
        // verify the token
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload
        if (!decoded.userId) throw new Error("Token not valid.")
        return decoded.userId
    } catch (error) {
        console.error(error, "Error from auth.middleware")
        return undefined
    }
}