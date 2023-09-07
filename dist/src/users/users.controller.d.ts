import { UserService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto, LoginUserDto, UpdateUserDto, UserChangePasswordDto, UserResetPasswordDto } from './dto/users-dto';
export declare class UserController {
    private readonly usersService;
    constructor(usersService: UserService);
    findOne(req: any): Promise<Partial<User>>;
    update(req: any, user: UpdateUserDto): Promise<User>;
    create(user: CreateUserDto): Promise<{
        token: string;
    }>;
    login(user: LoginUserDto): Promise<{
        token: string;
    }>;
    sendPasswordToken(body: UserChangePasswordDto, req: any): Promise<never>;
    resetPassword(body: UserResetPasswordDto): Promise<never>;
}
