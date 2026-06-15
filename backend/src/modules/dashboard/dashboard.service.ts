import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DashboardService {
  constructor(private db: DatabaseService) {}

  async getOverviewStats() {
    // 1. Tổng số nông hộ
    const farmerRes = await this.db.query(`SELECT COUNT(*) as total FROM farmer_profiles;`);
    const totalFarmers = parseInt(farmerRes.rows[0].total, 10);

    // 2. Tổng diện tích canh tác (ha)
    const landRes = await this.db.query(`SELECT COALESCE(SUM(area), 0) as total FROM lands;`);
    const totalAreaM2 = parseFloat(landRes.rows[0].total);
    // Giả sử area lưu theo m2, đổi ra ha
    const totalAreaHa = totalAreaM2; 

    // 3. Tổng sản lượng thu hoạch theo loại cây trồng (Cà phê, Tiêu, Sầu riêng...)
    const harvestRes = await this.db.query(`
      SELECT c.name as crop_name, SUM(h.quantity) as total_quantity, h.unit
      FROM harvests h
      JOIN crops c ON h.crop_id = c.id
      GROUP BY c.name, h.unit;
    `);

    // 4. Tổng doanh thu & chi phí & lợi nhuận
    const financialRes = await this.db.query(`
      SELECT 
        (SELECT COALESCE(SUM(amount), 0) FROM costs) as total_costs,
        (SELECT COALESCE(SUM(quantity * price_per_kg), 0) FROM harvests) as total_revenue
    `);
    const totalCosts = parseFloat(financialRes.rows[0].total_costs);
    const totalRevenue = parseFloat(financialRes.rows[0].total_revenue);
    const netProfit = totalRevenue - totalCosts;

    // 5. Số lượng sản phẩm OCOP được đánh giá sao
    const ocopRes = await this.db.query(`
      SELECT COUNT(*) as total, COALESCE(AVG(stars_awarded), 0)::numeric(3,2) as avg_stars
      FROM ocop_profiles
      WHERE status = 'approved';
    `);
    const totalOcop = parseInt(ocopRes.rows[0].total, 10);
    const avgOcopStars = parseFloat(ocopRes.rows[0].avg_stars);

    return {
      total_farmers: totalFarmers,
      total_area_ha: totalAreaHa,
      harvest_breakdown: harvestRes.rows,
      financials: {
        total_costs: totalCosts,
        total_revenue: totalRevenue,
        net_profit: netProfit,
      },
      ocop: {
        total_products: totalOcop,
        average_stars: avgOcopStars,
      },
    };
  }

  async getMapLayers() {
    // Lấy toàn bộ ranh giới thửa đất dưới dạng GeoJSON
    const landsQuery = `
      SELECT l.id, l.name as land_name, l.land_type, l.area,
             ST_AsGeoJSON(l.boundary)::json as boundary,
             u.full_name as owner_name, f.phone as owner_phone
      FROM lands l
      JOIN farmer_profiles f ON l.farmer_id = f.id
      JOIN users u ON f.user_id = u.id;
    `;
    const landsRes = await this.db.query(landsQuery);

    // Lấy định vị nhà ở của các nông hộ
    const farmersQuery = `
      SELECT f.id, u.full_name, f.phone, f.address,
             ST_AsGeoJSON(f.gps_home)::json as home_location
      FROM farmer_profiles f
      JOIN users u ON f.user_id = u.id;
    `;
    const farmersRes = await this.db.query(farmersQuery);

    return {
      lands: landsRes.rows,
      farmers: farmersRes.rows,
    };
  }
}
