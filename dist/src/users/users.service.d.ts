import { Repository, DataSource, EntityManager } from 'typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
export declare class UserService {
    private userRepository;
    private dbSource;
    private jwtService;
    manager: EntityManager;
    constructor(userRepository: Repository<User>, dbSource: DataSource, jwtService: JwtService);
    private removeNestedFields;
    create(user: Partial<User>): Promise<{
        token: string;
    }>;
    login(user: Partial<User>): Promise<{
        token: string;
    }>;
    getUser({ id, email }: {
        id?: number;
        email?: string;
    }): Promise<Partial<User>>;
    updateUser(id: number, user: Partial<User>): Promise<User>;
    sendPasswordToken(email: string, userId: number): Promise<never>;
    resetPassword({ email, token, password, confirmPassword, }: {
        email: string;
        token: string;
        password: string;
        confirmPassword: string;
    }): Promise<never>;
}
