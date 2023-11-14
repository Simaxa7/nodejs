export class JWTValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'JWTValidationError';
    }
}

export class NoJWTError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NoJWTError';
    }
}
