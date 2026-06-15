import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class LandsService {
  constructor(private db: DatabaseService) {}

  async create(farmerId: number, name: string, area: number, landType: string, wktBoundary: string) {
    const query = `
      INSERT INTO lands (farmer_id, name, area, land_type, boundary)
      VALUES ($1, $2, $3, $4, ST_GeomFromText($5, 4326))
      RETURNING id, name, area, land_type, ST_AsGeoJSON(boundary)::json as boundary, created_at;
    `;
    const res = await this.db.query(query, [farmerId, name, area, landType, wktBoundary]);
    return res.rows[0];
  }

  async findAll(farmerId?: number) {
    let query = `
      SELECT id, farmer_id, name, area, land_type, ST_AsGeoJSON(boundary)::json as boundary, created_at
      FROM lands
    `;
    const params = [];
    if (farmerId) {
      query += ` WHERE farmer_id = $1`;
      params.push(farmerId);
    }
    const res = await this.db.query(query, params);
    return res.rows;
  }

  async findOne(id: number) {
    const query = `
      SELECT id, farmer_id, name, area, land_type, ST_AsGeoJSON(boundary)::json as boundary, created_at
      FROM lands
      WHERE id = $1;
    `;
    const res = await this.db.query(query, [id]);
    if (res.rows.length === 0) {
      throw new NotFoundException(`Land with ID ${id} not found`);
    }
    return res.rows[0];
  }

  async importGeoJSON(farmerId: number, name: string, landType: string, geojsonGeometry: any) {
    // Chuyển đổi JSON Geometry sang PostGIS Geometry bằng ST_GeomFromGeoJSON
    const geomStr = JSON.stringify(geojsonGeometry);
    const query = `
      INSERT INTO lands (farmer_id, name, area, land_type, boundary)
      VALUES ($1, $2, ST_Area(ST_GeomFromGeoJSON($3)::geography) / 10000, $4, ST_SetSRID(ST_GeomFromGeoJSON($3), 4326))
      RETURNING id, name, area, land_type, ST_AsGeoJSON(boundary)::json as boundary, created_at;
    `;
    const res = await this.db.query(query, [farmerId, name, geomStr, landType]);
    return res.rows[0];
  }

  async remove(id: number) {
    const query = `DELETE FROM lands WHERE id = $1 RETURNING id;`;
    const res = await this.db.query(query, [id]);
    if (res.rows.length === 0) {
      throw new NotFoundException(`Land with ID ${id} not found`);
    }
    return { success: true, message: `Deleted land ID ${id}` };
  }
}
