import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class OcopService {
  constructor(private db: DatabaseService) {}

  // --- OCOP Profiles (Chứng nhận OCOP) ---
  async registerOcop(
    ownerId: string,
    productName: string,
    description: string,
    district: string,
    category: string,
  ) {
    const query = `
      INSERT INTO ocop_profiles (owner_id, product_name, description, district, category)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const res = await this.db.query(query, [ownerId, productName, description, district, category]);
    return res.rows[0];
  }

  async getOcopProfiles(district?: string, status?: string) {
    let query = `
      SELECT o.*, u.full_name as owner_name 
      FROM ocop_profiles o
      JOIN users u ON o.owner_id = u.id
    `;
    const params = [];
    let paramIndex = 1;

    if (district || status) {
      query += ` WHERE`;
      const filters = [];
      if (district) {
        filters.push(` o.district = $${paramIndex++}`);
        params.push(district);
      }
      if (status) {
        filters.push(` o.status = $${paramIndex++}`);
        params.push(status);
      }
      query += filters.join(' AND');
    }

    query += ` ORDER BY o.created_at DESC;`;
    const res = await this.db.query(query, params);
    return res.rows;
  }

  async updateOcopStatus(id: number, status: string, starsAwarded?: number, reviewNotes?: string, certificateUrl?: string) {
    const query = `
      UPDATE ocop_profiles
      SET status = $1,
          stars_awarded = COALESCE($2, stars_awarded),
          review_notes = COALESCE($3, review_notes),
          certificate_url = COALESCE($4, certificate_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *;
    `;
    const res = await this.db.query(query, [status, starsAwarded, reviewNotes, certificateUrl, id]);
    if (res.rows.length === 0) {
      throw new NotFoundException(`OCOP profile with ID ${id} not found`);
    }
    return res.rows[0];
  }

  // --- Market Products (Chợ Nông sản) ---
  async createMarketProduct(
    ownerId: string,
    title: string,
    description: string,
    price: number,
    unit: string,
    quantity: number,
    isOcop: boolean,
    ocopStars?: number,
    mediaUrls?: string[],
  ) {
    const query = `
      INSERT INTO market_products (owner_id, title, description, price, unit, quantity, is_ocop, ocop_stars, media_urls, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'approved')
      RETURNING *;
    `;
    const res = await this.db.query(query, [
      ownerId,
      title,
      description,
      price,
      unit,
      quantity,
      isOcop,
      ocopStars || null,
      mediaUrls || [],
    ]);
    return res.rows[0];
  }

  async getMarketProducts(isOcop?: boolean, status: string = 'approved') {
    let query = `
      SELECT m.*, u.full_name as seller_name, f.phone as seller_phone
      FROM market_products m
      JOIN users u ON m.owner_id = u.id
      LEFT JOIN farmer_profiles f ON u.id = f.user_id
      WHERE m.status = $1
    `;
    const params = [status];
    if (isOcop !== undefined) {
      query += ` AND m.is_ocop = $2`;
      params.push(isOcop ? 'true' : 'false');
    }
    query += ` ORDER BY m.created_at DESC;`;
    const res = await this.db.query(query, params);
    return res.rows;
  }
}
