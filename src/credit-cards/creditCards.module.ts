import { Module } from '@nestjs/common';
import { StripeModule } from 'src/stripe/stripe.module';
import CreditCardsController from './creditCards.controller';

@Module({
  imports: [StripeModule],
  controllers: [CreditCardsController],
  exports: [],
})
export class CreditCardsModule {}
