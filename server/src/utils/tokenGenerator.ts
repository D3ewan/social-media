import jwt from 'jsonwebtoken';

interface TokenPayload {
    _id: string;
}

export const generateRefreshToken = ({ _id }: TokenPayload): string | undefined => {
    try {
        const refreshToken = jwt.sign({ _id }, process.env.REFRESH_TOKEN_PRIVATE_KEY!, {
            expiresIn: '30d'
        })
        return refreshToken;
    } catch (e) {
        console.error({ message: (e as Error).message });
    }
}

export const generateAccessToken = ({ _id }: TokenPayload): string | undefined => {
    try {
        const accessToken = jwt.sign({ _id }, process.env.ACCESS_TOKEN_PRIVATE_KEY!, {
            expiresIn: '1d'
        })
        return accessToken;
    } catch (e) {
        console.error({ message: (e as Error).message });
    }
}