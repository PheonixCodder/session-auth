import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './database/config/typeorm.config';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './domain/user/user.module';
import { AuthModule } from './domain/auth/auth.module';

@Module({
  imports: [
    // Config module should be first
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),

    RedisModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
