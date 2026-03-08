import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { ErrorCodes } from 'src/common/error-codes';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JWT_SECRET } from 'src/common/jwt-constants';

import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  /** Access token TTL: mặc định 15m, có thể set JWT_ACCESS_EXPIRES_IN=30s để test refresh nhanh */
  private getAccessTokenExpiresIn(): string | number {
    const env = process.env.JWT_ACCESS_EXPIRES_IN;
    if (!env) return '15m';
    const num = Number(env);
    return Number.isFinite(num) ? num : env;
  }

  private async generateAndSaveTokens(
    userId: string,
    email: string,
    refreshTokenExpiresAt?: number,
  ) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      // JWT_ACCESS_EXPIRES_IN: '30s' | '15m' | number (seconds) - jsonwebtoken chấp nhận string
      expiresIn: this.getAccessTokenExpiresIn() as Parameters<
        JwtService['sign']
      >[1] extends { expiresIn?: infer E }
        ? E
        : never,
    });
    const refreshToken =
      refreshTokenExpiresAt !== undefined
        ? this.jwtService.sign({ ...payload, exp: refreshTokenExpiresAt })
        : this.jwtService.sign(payload, { expiresIn: '7d' });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });

    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email }
    })

    if (existingUser) {
      throw new ConflictException(ErrorCodes.AUTH.EMAIL_ALREADY_EXISTS)
    }

    const hashPassword = await bcrypt.hash(dto.password, 10)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        password: hashPassword
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        createAt: true
      }
    })

    const token = await this.generateAndSaveTokens(user.id, user.email)

    return {
      ...token,
      teacherId: user.id,
      fullName: user.fullName
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException(ErrorCodes.AUTH.INVALID_CREDENTIALS);
    }

    const isPasswordValid =
      user.password === dto.password ||
      (await bcrypt.compare(dto.password, user.password).catch(() => false));

    if (!isPasswordValid) {
      throw new BadRequestException(ErrorCodes.AUTH.INVALID_CREDENTIALS);
    }

    const token = await this.generateAndSaveTokens(user.id, dto.email);

    return {
      ...token,
      teacherId: user.id,
      fullName: user.fullName,
    };
  }

  async refreshToken(rt: string) {
    const payload = this.jwtService.verify(rt, {
      secret: JWT_SECRET,
    });

    const userId = payload.sub;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException(ErrorCodes.AUTH.ACCESS_DENIED);
    }

    const rtMatches = await bcrypt.compare(rt, user.refreshToken);
    if (!rtMatches) {
      throw new ForbiddenException(ErrorCodes.AUTH.ACCESS_DENIED);
    }

    const decoded = this.jwtService.decode(rt) as { exp?: number } | null;
    if (!decoded?.exp) {
      throw new ForbiddenException(ErrorCodes.AUTH.ACCESS_DENIED);
    }
    if (decoded.exp * 1000 < Date.now()) {
      throw new ForbiddenException(ErrorCodes.AUTH.REFRESH_TOKEN_EXPIRED);
    }

    return this.generateAndSaveTokens(user.id, user.email, decoded.exp);
  }

  async logout(userId: string) {
    await this.prisma.user.updateMany(
      {
        where: { id: userId, refreshToken: { not: null } },
        data: { refreshToken: null }
      },
    )

    return { messageKey: 'AUTH__LOGOUT_SUCCESS' };
  }
}
