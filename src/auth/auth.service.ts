import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CACHE_CONSTANT } from 'src/common/constants/cache.constant';
import { CustomerService } from 'src/customer/customer.service';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisCache } from 'cache-manager-redis-yet';
import { compareSync } from 'bcrypt';
import { JwtPayload } from './dtos/jwt-payload.dto';
import { LoginRequestDto } from './dtos/login-request.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private redisCache: RedisCache,
    private readonly jwtService: JwtService,
    private readonly customerService: CustomerService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  generateRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
    });
  }

  async login(loginRequestDto: LoginRequestDto) {
    const { email, password } = { ...loginRequestDto };
    const user = await this.customerService.getCustomerByEmailAlongWithPassword(
      email,
    );
    if (!user) {
      throw new BadRequestException('User not exist!');
    }
    const match = compareSync(password, user.hashed_password);

    if (!match) {
      throw new BadRequestException('Wrong email or password !');
    }

    const accessToken = this.generateAccessToken({
      userId: user._id.toString(),
      role: user.type,
    });

    const signatureAccessToken = accessToken.split('.')[2];

    const refreshToken = this.generateRefreshToken({
      userId: user._id.toString(),
      role: user.type,
    });

    const signatureRefreshToken = refreshToken.split('.')[2];

    await this.redisCache.store.client.hSetNX(
      `${CACHE_CONSTANT.SESSION_PREFIX}${user._id}`,
      signatureAccessToken,
      signatureRefreshToken,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(accessToken: string, userId: string): Promise<boolean> {
    const signature = accessToken.split('.')[2];
    const logoutResult = await this.redisCache.store.client.hDel(
      `${CACHE_CONSTANT.SESSION_PREFIX}${userId}`,
      signature,
    );

    return Boolean(logoutResult);
  }

  async refreshToken(accessToken: string, refreshToken: string) {
    const signatureAccessToken = accessToken.split('.')[2];
    const signatureRefreshToken = refreshToken.split('.')[2];

    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        payload = this.jwtService.decode(refreshToken) as JwtPayload;
        await this.redisCache.store.client.hDel(
          `${CACHE_CONSTANT.SESSION_PREFIX}${payload.userId}`,
          signatureAccessToken,
        );

        throw new BadRequestException('Expired refresh token');
      } else {
        throw new BadRequestException('Refresh token failed');
      }
    }

    const signatureRefreshTokenCache = await this.redisCache.store.client.hGet(
      `${CACHE_CONSTANT.SESSION_PREFIX}${payload.userId}`,
      signatureAccessToken,
    );

    if (
      !signatureRefreshTokenCache ||
      signatureRefreshTokenCache !== signatureRefreshToken
    ) {
      throw new BadRequestException('Refresh token failed');
    }

    const newAccessToken = this.generateAccessToken({
      userId: payload.userId,
      role: payload.role,
    });

    const newRefreshToken = this.generateRefreshToken({
      userId: payload.userId,
      role: payload.role,
    });

    const newSignatureAccessToken = newAccessToken.split('.')[2];
    const newSignatureRefreshToken = newRefreshToken.split('.')[2];

    await this.redisCache.store.client.hSetNX(
      `${CACHE_CONSTANT.SESSION_PREFIX}${payload.userId}`,
      newSignatureAccessToken,
      newSignatureRefreshToken,
    );

    await this.redisCache.store.client.hDel(
      `${CACHE_CONSTANT.SESSION_PREFIX}${payload.userId}`,
      signatureAccessToken,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
