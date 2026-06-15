import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      // Cho phép phát triển thử nghiệm bằng cách bỏ qua token nếu chế độ DEV bật
      const isDev = process.env.NODE_ENV !== 'production';
      if (isDev) {
        request.user = {
          id: 'usr_01',
          username: 'farmer_an',
          email: 'an.nguyen@gmail.com',
          full_name: 'Nguyễn Văn An',
          role: 'farmer',
        };
        return true;
      }
      throw new UnauthorizedException('Authorization header is missing');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Token format must be Bearer <token>');
    }

    const token = parts[1];
    try {
      // Decode JWT token (Keycloak format)
      const decoded = this.decodeToken(token);
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private decodeToken(token: string): any {
    // Trong môi trường Keycloak thật, ta sẽ xác thực signature qua Jwks hoặc public key.
    // Ở đây ta decode payload thô để trích xuất thông tin người dùng.
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        Buffer.from(base64, 'base64')
          .toString()
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      const parsed = JSON.parse(jsonPayload);
      
      return {
        id: parsed.sub || parsed.id || 'usr_01',
        username: parsed.preferred_username || parsed.username || 'farmer_an',
        email: parsed.email || 'an.nguyen@gmail.com',
        full_name: parsed.name || parsed.full_name || 'Nguyễn Văn An',
        role: parsed.resource_access?.sotayocoop?.roles?.[0] || parsed.role || 'farmer',
      };
    } catch (e) {
      // Mock user fallback if token is a test token
      if (token === 'test_farmer_token') {
        return { id: 'usr_01', username: 'farmer_an', role: 'farmer', full_name: 'Nguyễn Văn An' };
      } else if (token === 'test_htx_token') {
        return { id: 'usr_03', username: 'htx_dakdoa', role: 'htx', full_name: 'Hợp Tác Xã Đăk Đoa' };
      } else if (token === 'test_leader_token') {
        return { id: 'usr_05', username: 'leader_quan', role: 'leader', full_name: 'Nguyễn Văn Quân' };
      }
      throw new Error('JWT Decode Error');
    }
  }
}
