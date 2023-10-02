export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    companyName: string;
    country: string;
    town: string;
    state: string;
}
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    companyName?: string;
    country?: string;
    town?: string;
    state?: string;
}
export declare class LoginUserDto {
    email: string;
    password: string;
}
export declare class UserChangePasswordDto {
    email: string;
}
export declare class UserResetPasswordDto {
    email: string;
    token: string;
    password: string;
    confirmPassword: string;
}
