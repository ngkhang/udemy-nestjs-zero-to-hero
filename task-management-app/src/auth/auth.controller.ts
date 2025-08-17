import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name, {
    timestamp: true,
  });

  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() authCredentialDto: AuthCredentialDto,
  ): Promise<User['id']> {
    const userId = await this.authService.signUp(authCredentialDto);
    this.logger.verbose(`User: ${authCredentialDto.username} sign up`);
    return userId;
  }

  @Post('/signin')
  async signIn(
    @Body() authCredentialDto: AuthCredentialDto,
  ): Promise<Omit<User, 'password' | 'tasks'> & { accessToken: string }> {
    const user = await this.authService.signIn(authCredentialDto);
    this.logger.verbose(`User: ${authCredentialDto.username} sign in`);
    return user;
  }
}
