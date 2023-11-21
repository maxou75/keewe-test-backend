import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CurrenciesApi } from './currencies-api';
import { Conversion, Currencies, Payment } from './interfaces';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly currenciesApi: CurrenciesApi,
  ) {}

  @Get('currencies')
  async findAllCurrencies(): Promise<Currencies> {
    let result: Currencies;
    try {
      result = await this.currenciesApi.getCurrencies();
    } catch (e) {
      throw new HttpException(
        'Erreur lors de la récupération des devises.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return result;
  }

  @Get('conversion')
  async getConversion(
    @Query() query: { selectedCurrency: string; amount: number },
  ): Promise<Conversion> {
    let result: Conversion, currencies: Currencies;
    const { selectedCurrency, amount } = query;
    try {
      currencies = await this.currenciesApi.getCurrencies();
    } catch (e) {
      throw new HttpException(
        'Erreur lors de la récupération des devises.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (isNaN(amount) || !(selectedCurrency in currencies)) {
      throw new HttpException(
        'Les données transmises sont incorrectes.',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      result = await this.appService.getConversion(selectedCurrency, amount);
    } catch (e) {
      throw new HttpException(
        'Erreur lors de la conversion.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return result;
  }

  @Post('payment')
  async postPayment(
    @Body()
    data: {
      selectedCurrency: string;
      amount: number;
      cardData: string;
    },
  ): Promise<{
    selectedCurrency: string;
    paid: number;
  }> {
    let result, currencies: Currencies;
    try {
      currencies = await this.currenciesApi.getCurrencies();
    } catch (e) {
      throw new HttpException(
        'Erreur lors de la récupération des devises.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const { selectedCurrency, amount, cardData } = data;
    if (isNaN(amount) || !(selectedCurrency in currencies)) {
      throw new HttpException(
        'Les données transmises sont incorrectes.',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      result = await this.appService.postPayment(
        selectedCurrency,
        amount,
        cardData,
      );
    } catch (e) {
      throw new HttpException(
        'Erreur lors du paiement.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return result;
  }

  @Get('payments')
  async findAllPayments(): Promise<Payment[]> {
    let result: Payment[];
    try {
      result = await this.appService.getPayments();
    } catch (e) {
      throw new HttpException(
        'Erreur lors de la récupération des paiements.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return result;
  }
}
