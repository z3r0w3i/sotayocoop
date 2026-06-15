import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CropsService {
  constructor(private db: DatabaseService) {}

  // --- Crops ---
  async createCrop(landId: number, name: string, variety: string, area: number, quantity: number, startDate: string) {
    const query = `
      INSERT INTO crops (land_id, name, variety, area, quantity, start_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const res = await this.db.query(query, [landId, name, variety, area, quantity, startDate]);
    return res.rows[0];
  }

  async findAllCrops(farmerId?: number) {
    let query = `
      SELECT c.*, l.name as land_name 
      FROM crops c
      JOIN lands l ON c.land_id = l.id
    `;
    const params = [];
    if (farmerId) {
      query += ` WHERE l.farmer_id = $1`;
      params.push(farmerId);
    }
    const res = await this.db.query(query, params);
    return res.rows;
  }

  async findOneCrop(id: number) {
    const query = `SELECT * FROM crops WHERE id = $1;`;
    const res = await this.db.query(query, [id]);
    if (res.rows.length === 0) {
      throw new NotFoundException(`Crop with ID ${id} not found`);
    }
    return res.rows[0];
  }

  // --- Costs ---
  async addCost(cropId: number, costType: string, amount: number, description: string, quantity: number, unit: string, expenseDate: string) {
    const query = `
      INSERT INTO costs (crop_id, cost_type, amount, description, quantity, unit, expense_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const res = await this.db.query(query, [cropId, costType, amount, description, quantity, unit, expenseDate]);
    return res.rows[0];
  }

  async getCostsByCrop(cropId: number) {
    const crop = await this.findOneCrop(cropId);
    
    // Lấy chi tiết chi phí
    const costQuery = `SELECT * FROM costs WHERE crop_id = $1 ORDER BY expense_date DESC;`;
    const costRes = await this.db.query(costQuery, [cropId]);
    
    // Tính tổng chi phí và chi phí/ha
    const totalQuery = `SELECT SUM(amount) as total FROM costs WHERE crop_id = $1;`;
    const totalRes = await this.db.query(totalQuery, [cropId]);
    const total = parseFloat(totalRes.rows[0].total || '0');
    
    const area = parseFloat(crop.area || '1');
    const costPerHa = area > 0 ? (total / area) : total;

    return {
      crop_id: cropId,
      crop_name: crop.name,
      area,
      total_cost: total,
      cost_per_ha: costPerHa,
      items: costRes.rows,
    };
  }

  // --- Harvests ---
  async addHarvest(cropId: number, quantity: number, unit: string, quality: string, pricePerKg: number, buyer: string, harvestDate: string) {
    const query = `
      INSERT INTO harvests (crop_id, quantity, unit, quality, price_per_kg, buyer, harvest_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const res = await this.db.query(query, [cropId, quantity, unit, quality, pricePerKg, buyer, harvestDate]);
    return res.rows[0];
  }

  async getHarvestsByCrop(cropId: number) {
    const query = `SELECT * FROM harvests WHERE crop_id = $1 ORDER BY harvest_date DESC;`;
    const res = await this.db.query(query, [cropId]);
    return res.rows;
  }

  async getFinancialReport(cropId: number) {
    const crop = await this.findOneCrop(cropId);
    
    // Tổng chi phí
    const costQuery = `SELECT COALESCE(SUM(amount), 0) as total FROM costs WHERE crop_id = $1;`;
    const costRes = await this.db.query(costQuery, [cropId]);
    const totalCost = parseFloat(costRes.rows[0].total);

    // Tổng doanh thu
    const harvestQuery = `SELECT COALESCE(SUM(quantity * price_per_kg), 0) as total, COALESCE(SUM(quantity), 0) as total_qty FROM harvests WHERE crop_id = $1;`;
    const harvestRes = await this.db.query(harvestQuery, [cropId]);
    const totalRevenue = parseFloat(harvestRes.rows[0].total);
    const totalQuantity = parseFloat(harvestRes.rows[0].total_qty);

    const netProfit = totalRevenue - totalCost;
    const area = parseFloat(crop.area || '1');

    return {
      crop_id: cropId,
      crop_name: crop.name,
      area,
      total_cost: totalCost,
      total_revenue: totalRevenue,
      net_profit: netProfit,
      cost_per_ha: area > 0 ? (totalCost / area) : totalCost,
      profit_per_ha: area > 0 ? (netProfit / area) : netProfit,
      harvested_quantity: totalQuantity,
    };
  }

  // --- Traceability ---
  async createTraceability(cropId: number, brandName: string, certificates: string[]) {
    const query = `
      INSERT INTO traceability (crop_id, brand_name, certificates)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const res = await this.db.query(query, [cropId, brandName, certificates]);
    return res.rows[0];
  }

  async getTraceabilityInfo(qrUuid: string) {
    // Truy vấn thông tin chuỗi cung ứng cho người tiêu dùng quét QR
    const query = `
      SELECT t.qr_code_uuid, t.brand_name, t.certificates,
             c.name as crop_name, c.variety, c.start_date,
             f.phone, f.address, f.commune, f.district,
             u.full_name as farmer_name,
             ST_AsGeoJSON(l.boundary)::json as land_boundary
      FROM traceability t
      JOIN crops c ON t.crop_id = c.id
      JOIN lands l ON c.land_id = l.id
      JOIN farmer_profiles f ON l.farmer_id = f.id
      JOIN users u ON f.user_id = u.id
      WHERE t.qr_code_uuid = $1 AND t.status = 'active';
    `;
    const res = await this.db.query(query, [qrUuid]);
    if (res.rows.length === 0) {
      throw new NotFoundException(`Traceability info not found or inactive for QR Code: ${qrUuid}`);
    }

    const info = res.rows[0];

    // Lấy nhật ký canh tác liên quan để hiển thị cho người tiêu dùng
    const diaryQuery = `
      SELECT activity_type, activity_date, notes, media_urls
      FROM diaries
      WHERE crop_id = (SELECT crop_id FROM traceability WHERE qr_code_uuid = $1)
      ORDER BY activity_date ASC;
    `;
    const diaryRes = await this.db.query(diaryQuery, [qrUuid]);
    info.farming_diaries = diaryRes.rows;

    return info;
  }
}
