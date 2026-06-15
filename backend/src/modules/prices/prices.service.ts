import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PricesService {
  constructor(private db: DatabaseService) {}

  async getLatestPrices() {
    const query = `
      SELECT DISTINCT ON (crop_name) id, crop_name, price_date, price_min, price_max, source
      FROM prices
      ORDER BY crop_name, price_date DESC;
    `;
    const res = await this.db.query(query);
    return res.rows;
  }

  async getPriceHistory(cropName: string, limitDays: number = 30) {
    const query = `
      SELECT id, crop_name, price_date, price_min, price_max, source
      FROM prices
      WHERE crop_name = $1
      ORDER BY price_date ASC
      LIMIT $2;
    `;
    const res = await this.db.query(query, [cropName, limitDays]);
    return res.rows;
  }

  async updatePrice(cropName: string, priceMin: number, priceMax: number, source: string) {
    const query = `
      INSERT INTO prices (crop_name, price_min, price_max, source)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (crop_name, price_date) DO UPDATE
      SET price_min = EXCLUDED.price_min,
          price_max = EXCLUDED.price_max,
          source = EXCLUDED.source
      RETURNING *;
    `;
    const res = await this.db.query(query, [cropName, priceMin, priceMax, source]);
    return res.rows[0];
  }
}
