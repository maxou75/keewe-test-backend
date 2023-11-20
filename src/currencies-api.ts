import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, combineLatest, first, firstValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';

const apiKey: string = 'cur_live_92SH1np3TmHV3WNdZ7H1qmUez9HBuAmCpV1Zzzyw';
const endpointUrl: string = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&currencies=USD%2CEUR%2CGBP`;

const getEndpointUrl = (base: string) => `${endpointUrl}&base_currency=${base}`;

@Injectable()
export class CurrenciesApi {
  private currencies: any = {};
  /*private currencies: any = {
    'EUR/EUR': 1,
    'EUR/USD': 1.0911,
    'USD/EUR': 0.9162,
    'USD/USD': 1,
    'GBP/USD': 1.246,
    'USD/GBP': 0.8023,
    'GBP/GBP': 1,
    'EUR/GBP': 0.8754,
    'GBP/EUR': 1.1413,
  };*/

  constructor(private readonly httpService: HttpService) {}

  async getCurrencies(): Promise<object> {
    try {
      if (!Object.keys(this.currencies).length) await this.setCurrencies();
    } catch (e) {
      throw e;
    }
    return this.currencies;
  }

  private setCurrencyValue(base: string, sources: any) {
    Object.entries(sources).forEach(([, value]) => {
      this.currencies[`${base}/${value['code']}`] = value['value'];
    });
  }

  async setCurrencies(): Promise<any[]> {
    this.currencies = {};
    return await firstValueFrom(
      combineLatest([
        this.httpService.get<any[]>(getEndpointUrl('EUR')).pipe(
          first(),
          map(({ data }) => {
            this.setCurrencyValue('EUR', data['data']);
            return data;
          }),
        ),
        this.httpService.get<any[]>(getEndpointUrl('USD')).pipe(
          first(),
          map(({ data }) => {
            this.setCurrencyValue('USD', data['data']);
            return data;
          }),
        ),
        this.httpService.get<any[]>(getEndpointUrl('GBP')).pipe(
          first(),
          map(({ data }) => {
            this.setCurrencyValue('GBP', data['data']);
            return data;
          }),
        ),
      ]).pipe(
        catchError((error: AxiosError) => {
          console.log('error ', error.response);
          throw error;
        }),
      ),
    );
  }
}
