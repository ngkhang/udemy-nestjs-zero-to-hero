import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../jwt/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authCredentialDto: AuthCredentialDto): Promise<User['id']> {
    const userId = await this.userRepository.createUser(authCredentialDto);
    return userId;
  }

  async signIn(
    authCredentialDto: AuthCredentialDto,
  ): Promise<Omit<User, 'password'> & { accessToken: string }> {
    const user = await this.userRepository.findOne({
      where: {
        username: authCredentialDto.username,
      },
    });

    if (!user) throw new UnauthorizedException('User not found');

    if (!bcrypt.compareSync(authCredentialDto.password, user.password))
      throw new UnauthorizedException('Password is incorrect');

    const payloadJwt: JwtPayload = {
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(payloadJwt, {
      secret: 'udemy-nestjs-secret',
      expiresIn: 1 * 60 * 60,
    });

    return {
      id: user.id,
      username: user.username,
      tasks: user.tasks,
      accessToken,
    };
  }
}
