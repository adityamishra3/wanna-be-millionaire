import bcrypt from 'bcrypt'

export const hashPassword = async (password: string): Promise<string | false> =>{
    try {
        const hash = await bcrypt.hash(password, 10)
        return hash
    } catch (error) {
        console.error(error);
        return false; 
    }
}


export const comparePassword = async (password: string, hashed: string) => {
    try {
        const same = await bcrypt.compare(password, hashed)
        return same
    } catch (error) {
        console.error(error);
        return false;
    }
}