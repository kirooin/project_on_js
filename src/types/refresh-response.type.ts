export type RefreshResponseType = SuccessResponse | ErrorResponse;

type SuccessResponse = {
    error: false
    tokens: {
        accessToken: string,
        refreshToken: string,
    }
}

type ErrorResponse = {
    error: true,
    message: string,
    validation: {
        key: string,
        message: string,
    }
}