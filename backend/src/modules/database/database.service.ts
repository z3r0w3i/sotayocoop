import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const host = this.configService.get<string>('DB_HOST', 'localhost');
    const port = this.configService.get<number>('DB_PORT', 5432);
    const user = this.configService.get<string>('DB_USER', 'postgres');
    const password = this.configService.get<string>('DB_PASSWORD', 'postgres');
    const database = this.configService.get<string>('DB_NAME', 'sotayocoop');

    this.pool = new Pool({
      host,
      port,
      user,
      password,
      database,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test connection
    try {
      const client = await this.pool.connect();
      this.logger.log(`Successfully connected to database: ${database} at ${host}:${port}`);
      client.release();
    } catch (error) {
      this.logger.error(`Failed to connect to database: ${error.message}`);
    }
  }

  async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const start = Date.now();
    try {
      const res = await this.pool.query<T>(text, params);
      const duration = Date.now() - start;
      this.logger.debug(`Executed query: ${text} | Duration: ${duration}ms | Rows: ${res.rowCount}`);
      return res;
    } catch (error) {
      this.logger.error(`Error executing query: ${text} | Error: ${error.message}`);
      throw error;
    }
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async onModuleDestroy() {
    await this.pool.end();
    this.logger.log('Database pool closed.');
  }
}
