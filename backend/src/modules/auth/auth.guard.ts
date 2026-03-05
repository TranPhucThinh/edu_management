import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';
import { IS_PUBLIC_KEY } from "../../common/decorators/public.decorator";
import { ErrorCodes } from "src/common/error-codes";
import { JWT_SECRET } from "src/common/jwt-constants";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException(ErrorCodes.AUTH.ACCESS_DENIED)
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET,
      })

      request['user'] = {
        teacherId: payload.sub,
        email: payload.email
      }
    } catch (error) {
      console.log("🚀 ~ AuthGuard ~ canActivate ~ error:", error)
      throw new UnauthorizedException(ErrorCodes.AUTH.ACCESS_DENIED)
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? []
    return type === 'Bearer' ? token : undefined
  }
}
