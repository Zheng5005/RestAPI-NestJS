import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Payload } from './models/payload.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService
  ) {}

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

  async generateToken(user: User) {
    const payload: Payload = { sub: user.id };
    return this.jwtService.sign(payload)
  }
}
