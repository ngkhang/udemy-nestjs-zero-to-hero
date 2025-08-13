import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() authCredentialDto: AuthCredentialDto,
  ): Promise<User['id']> {
    const userId = await this.authService.signUp(authCredentialDto);
    return userId;
  }

  @Post('/signin')
  async signIn(
    @Body() authCredentialDto: AuthCredentialDto,
  ): Promise<Omit<User, 'password'> & { accessToken: string }> {
    const user = await this.authService.signIn(authCredentialDto);
    return user;
  }
}
