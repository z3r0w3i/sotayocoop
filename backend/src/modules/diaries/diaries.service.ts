import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DiariesService {
  constructor(private db: DatabaseService) {}

  async create(
    cropId: number,
    activityType: string,
    notes: string,
    wktLocation: string | null,
    mediaUrls: string[],
    createdBy: string,
  ) {
    const query = `
      INSERT INTO diaries (crop_id, activity_type, notes, gps_location, media_urls, created_by)
      VALUES ($1, $2, $3, ${wktLocation ? `ST_GeomFromText($4, 4326)` : 'NULL'}, $5, $6)
      RETURNING id, crop_id, activity_type, activity_date, notes, ST_AsGeoJSON(gps_location)::json as gps_location, media_urls, created_by;
    `;
    const params = [cropId, activityType, notes];
    if (wktLocation) {
      params.push(wktLocation);
    }
    params.push(mediaUrls, createdBy);

    const res = await this.db.query(query, params);
    return res.rows[0];
  }

  async findAll(cropId?: number) {
    let query = `
      SELECT d.id, d.crop_id, c.name as crop_name, d.activity_type, d.activity_date, d.notes, 
             ST_AsGeoJSON(d.gps_location)::json as gps_location, d.media_urls, u.full_name as author
      FROM diaries d
      JOIN crops c ON d.crop_id = c.id
      JOIN users u ON d.created_by = u.id
    `;
    const params = [];
    if (cropId) {
      query += ` WHERE d.crop_id = $1`;
      params.push(cropId);
    }
    query += ` ORDER BY d.activity_date DESC`;
    const res = await this.db.query(query, params);
    return res.rows;
  }

  async findOne(id: number) {
    const query = `
      SELECT d.id, d.crop_id, c.name as crop_name, d.activity_type, d.activity_date, d.notes, 
             ST_AsGeoJSON(d.gps_location)::json as gps_location, d.media_urls, u.full_name as author
      FROM diaries d
      JOIN crops c ON d.crop_id = c.id
      JOIN users u ON d.created_by = u.id
      WHERE d.id = $1;
    `;
    const res = await this.db.query(query, [id]);
    if (res.rows.length === 0) {
      throw new NotFoundException(`Diary entry with ID ${id} not found`);
    }
    return res.rows[0];
  }
}
