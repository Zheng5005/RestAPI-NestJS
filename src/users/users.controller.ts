import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UnprocessableEntityException } from '@nestjs/common';
import { randomUUID } from 'crypto';

interface User {
  id: string;
  name: string;
  email: string;
}

@Controller('users')
export class UsersController {
  private users: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com"
    },
    {
      id: "2",
      name: "Jane Doe",
      email: "jane.doe@example.com"
    }
  ]

  @Get()
  getUsers(): User[] {
    return this.users
  }

  @Get(":id")
  findUser(@Param('id') id: string) {
    const user = this.users.find((user) => user.id === id)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@”]+(\.[^<>()[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  }

  @Post()
  createUser(@Body() body: User): User {
    const newUser: User = {...body, id: randomUUID()}
    this.users.push(newUser)
    return newUser
  }

  @Put(':id')
  updateUser(@Body() body: User, @Param('id') id: string) {
    const position = this.users.findIndex((user) => user.id === id)
    if (position === -1) {
      throw new NotFoundException('User not found')
    }

    const currentData = this.users[position];
    const email = this.validateEmail(body?.email)

    if (!email) {
      throw new UnprocessableEntityException
    }

    const updatedUser = {
      ...currentData,
      ...body
    }
    this.users[position] = updatedUser
    return updatedUser
  }

  @Delete(':id')
  deleteUser(@Param("id") id: string) {
    const user = this.users.find((user) => user.id === id)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    this.users = this.users.filter((user) => user.id !== id)
    return {
      message: 'User deleted'
    }
  }
}
