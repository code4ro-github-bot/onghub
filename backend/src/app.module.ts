import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { RateLimiterConfigService } from './common/config/rate-limiter-config.service';
import { validate } from './env.validation';
import { OrganizationModule } from './modules/organization/organization.module';
import { DatabaseProviderModule } from './providers/database/database-provider.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({ validate, isGlobal: true }),
    ThrottlerModule.forRootAsync({
      useClass: RateLimiterConfigService,
    }),
    DatabaseProviderModule,
    OrganizationModule,
    SharedModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // TODO: move this when required
    },
  ],
})
export class AppModule {}
