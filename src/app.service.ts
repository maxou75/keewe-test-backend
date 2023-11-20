import { Injectable } from '@nestjs/common';
import { Database } from "./database";
import { CurrenciesApi } from './currencies-api';

@Injectable()
export class AppService {
  constructor(
    private readonly currenciesApi: CurrenciesApi,
    private database: Database,
  ) {}
  async postPayment(
    selectedCurrency: string,
    amount: number,
    cardData: object,
  ): Promise<{
    selectedCurrency: string;
    paid: number;
  }> {
    const currencies = await this.currenciesApi.getCurrencies();
    const paid = currencies[selectedCurrency] * amount;
    await this.database.insertPayment({
      selectedCurrency,
      paid,
      cardData,
    });
    return { selectedCurrency, paid };
  }

  async getConversion(
    selectedCurrency: string,
    amount: number,
  ): Promise<object> {
    const currencies = await this.currenciesApi.getCurrencies();
    const convertedAmount = amount * currencies[selectedCurrency];
    return {
      selectedCurrency,
      amount,
      convertedAmount,
    };
  }

  async getPayments(): Promise<object[]> {
    return await this.database.getPaymentCollection();
  }
}
