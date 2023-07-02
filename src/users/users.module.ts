import { Global, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import User from './user.entity';
import { StripeModule } from 'src/stripe/stripe.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User]), StripeModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
