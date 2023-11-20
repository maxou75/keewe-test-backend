import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CurrenciesApi } from './currencies-api';
import { HttpModule } from '@nestjs/axios';
import { Database } from './database';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, CurrenciesApi, Database],
})
export class AppModule {}
