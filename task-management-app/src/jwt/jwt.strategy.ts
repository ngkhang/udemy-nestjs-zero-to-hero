import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.type';
import { User } from '../auth/user.entity';
import { UserRepository } from '../auth/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'udemy-nestjs-secret',
      ignoreExpiration: false,
    });
  }

  async validate({ username }: JwtPayload): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (!user) throw new UnauthorizedException('UnAuthorized');

    return user;
  }
}
