import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService) {}
}
