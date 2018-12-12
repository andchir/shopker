export class UserOption {
    constructor(
        public name: string,
        public title: string,
        public value: string
    ) { }
}

export class User {
    constructor(
        public id: number,
        public email: string,
        public fullName: string,
        public roles: string[],
        public isActive: boolean,
        public options: UserOption[],
        public role?: string,
        public phone?: string,
        public password?: string,
        public confirmPassword?: string
    ) { }
}
