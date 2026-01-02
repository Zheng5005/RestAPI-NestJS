import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength, ValidateNested } from 'class-validator';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';
import { PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8)
  password: string;

  @IsEmail({}, { message: 'Email is not valid' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @ValidateNested()
  @Type(() => CreateProfileDto)
  @IsNotEmpty()
  profile: CreateProfileDto
}

export class UpdateUserDto extends PartialType(CreateProfileDto) {
  @ValidateNested()
  @Type(() => UpdateProfileDto)
  @IsNotEmpty()
  profile: UpdateProfileDto
}
