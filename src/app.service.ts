import { Injectable } from '@nestjs/common';
import { Database } from './database';
import { CurrenciesApi } from './currencies-api';
import { Conversion, Currencies, Payment } from './interfaces';

@Injectable()
export class AppService {
  constructor(
    private readonly currenciesApi: CurrenciesApi,
    private database: Database,
  ) {}
  async postPayment(
    currency: string,
    amount: number,
    cardData: string,
  ): Promise<Payment> {
    const currencies = await this.currenciesApi.getCurrencies();
    const paid = currencies[currency] * amount;
    await this.database.insertPayment(currency, paid, cardData);
    return { currency, paid } as Payment;
  }

  async getConversion(currency: string, amount: number): Promise<Conversion> {
    const currencies: Currencies = await this.currenciesApi.getCurrencies();
    const convertedAmount: number = amount * currencies[currency];
    return {
      currency,
      amount,
      convertedAmount,
    };
  }

  async getPayments(): Promise<Payment[]> {
    return await this.database.getPaymentCollection();
  }
}
