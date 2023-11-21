import { addRxPlugin, createRxDatabase } from 'rxdb';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { RxDatabase } from 'rxdb/dist/types/types';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { Injectable } from '@nestjs/common';
import { Payment } from './interfaces';

@Injectable()
export class Database {
  private db: RxDatabase;
  private numberOfPayments: number = 0;

  constructor() {
    this.initDb();
    process.on('SIGINT', async () => {
      if (this.db) {
        console.log('Closing database connection...');
        await this.db.destroy();
        console.log('Database connection closed.');
      }
      process.exit();
    });
  }

  private async initDb(): Promise<void> {
    addRxPlugin(RxDBMigrationPlugin);
    addRxPlugin(RxDBJsonDumpPlugin);
    this.db = await createRxDatabase({
      name: 'keewe_test_db',
      storage: getRxStorageMemory(),
      ignoreDuplicate: true,
    });

    const paymentSchema = {
      title: 'payment schema',
      version: 1,
      primaryKey: 'id',
      type: 'object',
      properties: {
        id: {
          type: 'string',
          maxLength: 100,
        },
        date: {
          type: 'number',
        },
        selectedCurrency: {
          type: 'string',
        },
        paid: {
          type: 'number',
        },
        status: {
          type: 'string',
        },
        cardData: {
          type: 'string',
        },
      },
    };
    await this.db.addCollections({
      payment: {
        schema: paymentSchema,
      },
    });
  }

  async insertPayment(
    selectedCurrency: string,
    paid: number,
    cardData: string,
  ): Promise<void> {
    this.numberOfPayments++;
    await this.db.payment.insert({
      id: `payment_${this.numberOfPayments}`,
      date: Date.now(),
      currency: selectedCurrency,
      paid: paid,
      status: 'valid',
      cardData: cardData,
    });
  }

  async getPaymentCollection(): Promise<Payment[]> {
    const payments = await this.db.payment.exportJSON();
    return payments.docs.map((p) => ({
      currency: p.currency,
      date: p.date,
      id: p.id,
      paid: p.paid,
      status: p.status,
    }));
  }
}
