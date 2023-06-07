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
}
