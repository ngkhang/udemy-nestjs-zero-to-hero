import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(authCredentialDto: AuthCredentialDto): Promise<User['id']> {
    const userId = await this.userRepository.createUser(authCredentialDto);
    return userId;
  }

  async signIn(
    authCredentialDto: AuthCredentialDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: {
        username: authCredentialDto.username,
      },
    });

    if (!user) throw new UnauthorizedException('User not found');

    if (!bcrypt.compareSync(authCredentialDto.password, user.password))
      throw new UnauthorizedException('Password is incorrect');

    return {
      id: user.id,
      username: user.username,
    };
  }
}
