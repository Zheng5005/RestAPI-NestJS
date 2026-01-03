import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  //sdf
  async validateUser(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email)
    if (!user) {
      throw new UnauthorizedException('Unauthorized')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new UnauthorizedException('Unauthorized')
    }

    return user
  }
}
