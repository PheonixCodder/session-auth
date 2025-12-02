import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: RedisClientType;
  private readonly logger = new Logger(RedisService.name);

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.config.get<string>('REDIS_URL');
    this.client = createClient({ url: redisUrl });
    this.client.on('error', (e) => {
      this.logger.log(e);
    });

    await this.client.connect();
    this.logger.log('Connected');
  }

  getClient(): RedisClientType {
    return this.client;
  }
}
