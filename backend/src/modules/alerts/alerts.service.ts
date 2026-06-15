import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AlertsService {
  constructor(private db: DatabaseService) {}

  // --- Weather Alerts ---
  async createWeatherAlert(
    alertType: string,
    description: string,
    severity: string,
    wktBoundary: string,
    startDate: string,
    endDate: string,
  ) {
    const query = `
      INSERT INTO weather_alerts (alert_type, description, severity, boundary, start_date, end_date)
      VALUES ($1, $2, $3, ST_GeomFromText($4, 4326), $5, $6)
      RETURNING id, alert_type, description, severity, ST_AsGeoJSON(boundary)::json as boundary, start_date, end_date;
    `;
    const res = await this.db.query(query, [alertType, description, severity, wktBoundary, startDate, endDate]);
    return res.rows[0];
  }

  async getWeatherAlerts() {
    const query = `
      SELECT id, alert_type, description, severity, ST_AsGeoJSON(boundary)::json as boundary, start_date, end_date
      FROM weather_alerts
      WHERE end_date >= NOW()
      ORDER BY created_at DESC;
    `;
    const res = await this.db.query(query);
    return res.rows;
  }

  // --- Disease Alerts ---
  async createDiseaseAlert(
    targetType: string,
    targetName: string,
    diseaseName: string,
    description: string,
    preventionMeasures: string,
    wktBoundary: string,
  ) {
    const query = `
      INSERT INTO disease_alerts (target_type, target_name, disease_name, description, prevention_measures, boundary)
      VALUES ($1, $2, $3, $4, $5, ST_GeomFromText($6, 4326))
      RETURNING id, target_type, target_name, disease_name, description, prevention_measures, ST_AsGeoJSON(boundary)::json as boundary;
    `;
    const res = await this.db.query(query, [targetType, targetName, diseaseName, description, preventionMeasures, wktBoundary]);
    return res.rows[0];
  }

  async getDiseaseAlerts() {
    const query = `
      SELECT id, target_type, target_name, disease_name, description, prevention_measures, ST_AsGeoJSON(boundary)::json as boundary, created_at
      FROM disease_alerts
      ORDER BY created_at DESC;
    `;
    const res = await this.db.query(query);
    return res.rows;
  }

  // --- Location Specific Querying ---
  async getAlertsByLocation(longitude: number, latitude: number) {
    // Tìm tất cả cảnh báo thời tiết đang hoạt động có đa giác chứa điểm này
    const weatherQuery = `
      SELECT id, alert_type, description, severity, start_date, end_date
      FROM weather_alerts
      WHERE end_date >= NOW() 
        AND ST_Contains(boundary, ST_SetSRID(ST_Point($1, $2), 4326));
    `;
    const weatherRes = await this.db.query(weatherQuery, [longitude, latitude]);

    // Tìm tất cả cảnh báo dịch bệnh có đa giác chứa điểm này
    const diseaseQuery = `
      SELECT id, target_type, target_name, disease_name, description, prevention_measures
      FROM disease_alerts
      WHERE ST_Contains(boundary, ST_SetSRID(ST_Point($1, $2), 4326));
    `;
    const diseaseRes = await this.db.query(diseaseQuery, [longitude, latitude]);

    return {
      weather: weatherRes.rows,
      diseases: diseaseRes.rows,
    };
  }
}
