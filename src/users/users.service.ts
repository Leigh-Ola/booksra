import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager, Not, IsNull } from 'typeorm';
import { User } from './user.entity';
// import lodash function
import { omit, pick } from 'lodash';
// import * as bcrypt from 'bcrypt';
// import * as simplecrypt from 'simplecrypt';
import * as bcrypt from 'bcrypt-node';
import { JwtService } from '@nestjs/jwt';
import { throwBadRequest, generateRandomNumberString } from '../utils/helpers';
import { ChangePassword } from './change-password.entity';
import { forgotPasswordTemplate } from '../mail/templates/forgot-password';
import { sendMail } from '../mail/mail.service';

@Injectable()
export class UserService {
  manager: EntityManager;
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dbSource: DataSource,
    private jwtService: JwtService,
  ) {
    this.manager = this.dbSource.manager;
  }

  private removeNestedFields(collection: any, fields: string[]) {
    return collection.map((item) => {
      return omit(item, fields);
    });
  }

  async create(user: Partial<User>) {
    // if the user exists (matched name, with non-null password), return error
    const userExists = await this.manager.findOne(User, {
      where: { email: user.email, password: Not(IsNull()) },
      select: ['id'],
    });
    if (userExists) {
      return throwBadRequest('This email address is already taken');
    }
    user = pick(user, [
      'firstName',
      'lastName',
      'email',
      'phone',
      'address',
      'companyName',
      'country',
      'town',
      'state',
      'password',
    ]) as Partial<User>;
    if (typeof user.password === 'string' && user.password.length > 0) {
      user.password = bcrypt.hashSync(user.password);
    } else {
      user.password = null;
    }
    const newuser = await this.userRepository.save(
      this.userRepository.create(user),
    );
    const payload = {
      id: Number(newuser.id),
      email: newuser.email,
      role: newuser.role,
    };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      token: access_token,
    };
  }

  async login(user: Partial<User>) {
    const userExists = await this.manager.findOne(User, {
      where: { email: user.email, password: Not(IsNull()) },
      select: ['id', 'password', 'email', 'role'],
    });
    if (!userExists) {
      return throwBadRequest('Invalid credentials');
    }
    if (!userExists.password) {
      return throwBadRequest('Invalid credentials');
      // return throwBadRequest('This user does not have an account');
    }
    // const isMatch = await bcrypt.compareSync(user.password, userExists.password);
    const isMatch = await bcrypt.compareSync(
      user.password,
      userExists.password,
    );
    if (!isMatch) {
      return throwBadRequest('Invalid credentials');
    }
    const payload = {
      id: Number(userExists.id),
      email: userExists.email,
      role: userExists.role,
    };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      token: access_token,
    };
  }

  async getUser({ id, email }: { id?: number; email?: string }) {
    if (!id && !email) return null;
    const user = await this.userRepository.findOne({
      where: {
        ...(id && { id }),
        ...(email && { email }),
      },
    });
    if (!user) {
      return throwBadRequest('User does not exist');
    }
    return pick(user, [
      'firstName',
      'lastName',
      'email',
      'phone',
      'address',
      'companyName',
      'country',
      'town',
      'state',
      'role',
    ]) as Partial<User>;
  }

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    if (!id || isNaN(id)) {
      return throwBadRequest('User ID is required');
    }
    const userExists = await this.manager.findOne(User, {
      where: { id },
      select: ['id'],
    });
    if (!userExists) {
      return throwBadRequest('User does not exist');
    }
    user = pick(user, [
      'firstName',
      'lastName',
      'email',
      'phone',
      'address',
      'companyName',
      'country',
      'town',
      'state',
    ]) as Partial<User>;
    if (!Object.keys(user).length) {
      return;
    }
    await this.userRepository.update(id, user);
    return;
  }

  async sendPasswordToken(email: string) {
    const userExists = await this.manager.findOne(User, {
      where: { email: email, password: Not(IsNull()) },
      select: ['id', 'email'],
      relations: ['passwordToken'],
    });
    if (!userExists) {
      return throwBadRequest('User does not exist');
    }

    // get node env
    const token = generateRandomNumberString(6);
    // nodeEnv === 'production' ? generateRandomNumberString(6) : '000000';
    const encryptedToken = bcrypt.hashSync(token);
    const passwordTokenEntry = userExists.passwordToken;
    const template = forgotPasswordTemplate({
      recipient: userExists.email,
      subject: 'Password Reset',
      data: {
        token,
      },
    });
    await sendMail(template);
    if (passwordTokenEntry?.id) {
      await this.manager.update(ChangePassword, passwordTokenEntry.id, {
        token: encryptedToken,
      });
    } else {
      await this.manager.save(ChangePassword, {
        token: encryptedToken,
        userId: userExists.id,
      });
    }
  }

  async resetPassword({
    email,
    token,
    password,
    confirmPassword,
  }: {
    email: string;
    token: string;
    password: string;
    confirmPassword: string;
  }) {
    if (password !== confirmPassword) {
      return throwBadRequest('Passwords do not match');
    }
    const userExists = await this.manager.findOne(User, {
      where: { email },
      select: ['id'],
      relations: ['passwordToken'],
    });
    if (!userExists) {
      return throwBadRequest('User does not exist');
    }
    const passwordTokenEntry = userExists.passwordToken;
    if (!passwordTokenEntry?.token) {
      return throwBadRequest('Invalid token');
    }
    const isTokenMatch = await bcrypt.compareSync(
      token,
      passwordTokenEntry.token,
    );
    if (!isTokenMatch) {
      return throwBadRequest('Incorrect token');
    }
    // check if token has expired
    const now = new Date();
    const tokenCreation = new Date(passwordTokenEntry.updatedAt);
    const { TOKEN_EXPIRY } = process.env;
    const tokenExpiryMinutes = isNaN(parseInt(TOKEN_EXPIRY, 10))
      ? parseInt(TOKEN_EXPIRY, 10)
      : 15;
    tokenCreation.setMinutes(tokenCreation.getMinutes() + tokenExpiryMinutes); // token expires in 15 minutes
    if (now > tokenCreation) {
      return throwBadRequest('Token has expired');
    }
    await this.manager.update(
      User,
      {
        id: userExists.id,
      },
      {
        // password: await bcrypt.hash(password, 10),
        password: bcrypt.hashSync(password),
      },
    );
    // delete the password token
    await this.manager.delete(ChangePassword, {
      id: passwordTokenEntry.id,
    });
  }
}
