export class User {
    constructor(
        public id: number,
        public email: string,
        public fullName: string,
        public roles: string[],
        public isActive: boolean,
        public phone?: string,
        public address?: string
    ) { }
}