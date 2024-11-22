interface User {
    name: string;
    email: string;
    image?: string

}

interface SocketUser {
    userId: string;
    username: string;
    self?: boolean;
    messages: {
        message: string,
        fromSelf: boolean
    }[];
}

