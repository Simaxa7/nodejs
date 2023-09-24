export interface User {
    id?: string;
    login: string;
    password: string;
    age: number;
    is_deleted: boolean;
}

export interface UserUpdates {
    id?: string;
    login?: string;
    password?: string;
    age?: number;
    is_deleted?: boolean;
}
