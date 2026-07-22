export type ResponseLoginType = {
    tokens: {
        accessToken: string;
        refreshToken: string;
    }
    user: {
        id: number,
        name: string,
        lastName: string,
    }
}