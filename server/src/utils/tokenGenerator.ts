import jwt from 'jsonwebtoken';

// Define the structure of the token payload
interface TokenPayload {
    _id: string;
}

// Function to generate a refresh token
// Refresh tokens generally have a longer expiry time than access tokens
export const generateRefreshToken = ({ _id }: TokenPayload): string | undefined => {
    try {
        const refreshToken = jwt.sign({ _id }, process.env.REFRESH_TOKEN_PRIVATE_KEY!, {
            expiresIn: '30d' // Expiry time of 30 days
        });
        return refreshToken;
    } catch (e) {
        console.error({ message: (e as Error).message });
        return undefined;
    }
};

// Function to generate an access token
export const generateAccessToken = ({ _id }: TokenPayload): string | undefined => {
    try {
        const accessToken = jwt.sign({ _id }, process.env.ACCESS_TOKEN_PRIVATE_KEY!, {
            expiresIn: '1d' // Expiry time of 1 day
        });
        return accessToken;
    } catch (e) {
        console.error({ message: (e as Error).message });
        return undefined;
    }
};
