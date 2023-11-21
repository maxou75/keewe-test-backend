import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { CurrenciesApi } from './currencies-api';
import { Database } from './database';
import * as request from 'supertest';
import { Payment } from './interfaces';

describe('AppController', () => {
  let app: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AppController],
      providers: [AppService, CurrenciesApi, Database],
    }).compile();

    // appController = app.get<AppController>(AppController);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Currencies', () => {
    it('should return currencies', async () => {
      const properties = [
        'EUR/EUR',
        'EUR/GBP',
        'EUR/USD',
        'GBP/EUR',
        'GBP/GBP',
        'USD/EUR',
        'USD/GBP',
        'USD/USD',
      ];
      return request(app.getHttpServer())
        .get('/currencies')
        .expect(({ body }) => {
          properties.forEach((p: string) => {
            expect(body).toHaveProperty(p);
          });
        });
    });
  });

  describe('Conversions', () => {
    it('should convert with specified currency', async () => {
      return request(app.getHttpServer())
        .get('/conversion?amount=34&selectedCurrency=GBP%2FUSD')
        .expect(200)
        .expect(({ body }) => {
          ['amount', 'convertedAmount', 'selectedCurrency'].forEach(
            (p: string) => {
              expect(body).toHaveProperty(p);
            },
          );
        });
    });

    it('should return error if no parameters', async () => {
      return request(app.getHttpServer()).get('/conversion').expect(400);
    });

    it('should return error if invalid amount parameter', async () => {
      return request(app.getHttpServer())
        .get('/conversion?amount=a&selectedCurrency=GBP%2FUSD')
        .expect(400);
    });

    it('should return error if invalid currency parameters', async () => {
      return request(app.getHttpServer())
        .get('/conversion?amount=34&selectedCurrency=GBP%2FJPN')
        .expect(400);
    });
  });

  describe('Payments', () => {
    const validPayment1 = {
      selectedCurrency: 'EUR/USD',
      amount: 10,
      cardData: 'test',
    };
    const invalidPayment1 = {
      selectedCurrency: 'EUR/JPN',
      amount: 15,
      cardData: 'test',
    };
    const invalidPayment2 = {
      selectedCurrency: 'EUR/USD',
      amount: 'pomme',
      cardData: 'test',
    };

    it('should insert payment', async () => {
      return request(app.getHttpServer())
        .post('/payment')
        .send(validPayment1)
        .expect(201)
        .expect(({ body }) => {
          ['paid', 'selectedCurrency'].forEach((p: string) => {
            expect(body).toHaveProperty(p);
          });
        });
    });

    it('should not insert payment with invalid currency', async () => {
      return request(app.getHttpServer())
        .post('/payment')
        .send(invalidPayment1)
        .expect(400);
    });

    it('should not insert payment with invalid amount', async () => {
      return request(app.getHttpServer())
        .post('/payment')
        .send(invalidPayment2)
        .expect(400);
    });

    it('should retrieve all payments', async () => {
      return request(app.getHttpServer())
        .get('/payments')
        .expect(200)
        .expect(({ body }) => {
          expect(body?.length).toBe(1);
          body.forEach((payment: Payment) => {
            ['currency', 'date', 'id', 'paid', 'status'].forEach(
              (p: string) => {
                expect(payment).toHaveProperty(p);
              },
            );
          });
        });
    });
  });
});
