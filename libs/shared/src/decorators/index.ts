import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { RATE_LIMIT } from '../constants';
import { RateLimitGuard } from '../guards/rate-limit.guard';

export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';
export const RATE_LIMIT_KEY = 'rate_limit';

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

export const RateLimit = (options: { points: number; duration: number }) => {
  return applyDecorators(
    SetMetadata(RATE_LIMIT_KEY, options),
    UseGuards(RateLimitGuard),
  );
};

export const AuthRateLimit = () => RateLimit(RATE_LIMIT.AUTH.LOGIN);

export const RegisterRateLimit = () => RateLimit(RATE_LIMIT.AUTH.REGISTER);

export const ChatRateLimit = () => RateLimit(RATE_LIMIT.CHAT.MESSAGE);

export const ApiRateLimit = () => RateLimit(RATE_LIMIT.API.DEFAULT);

export const Public = () => SetMetadata('isPublic', true);

export const SkipAuth = () => SetMetadata('skipAuth', true);

export const SkipValidation = () => SetMetadata('skipValidation', true);

export const SkipRateLimit = () => SetMetadata('skipRateLimit', true);

export const SkipCache = () => SetMetadata('skipCache', true);

export const CacheKey = (key: string) => SetMetadata('cacheKey', key);

export const CacheTTL = (ttl: number) => SetMetadata('cacheTTL', ttl);

export const Version = (version: string) => SetMetadata('version', version);

export const Deprecated = (message?: string) =>
  SetMetadata('deprecated', message || true);

export const ApiTags = (...tags: string[]) =>
  SetMetadata('swagger/apiTags', tags);

export const ApiOperation = (summary: string) =>
  SetMetadata('swagger/apiOperation', { summary });

export const ApiResponse = (options: {
  status: number;
  description: string;
  type?: any;
}) => SetMetadata('swagger/apiResponse', options);

export const ApiParam = (options: {
  name: string;
  description?: string;
  required?: boolean;
  type?: any;
}) => SetMetadata('swagger/apiParam', options);

export const ApiQuery = (options: {
  name: string;
  description?: string;
  required?: boolean;
  type?: any;
}) => SetMetadata('swagger/apiQuery', options);

export const ApiBody = (options: {
  type: any;
  description?: string;
  required?: boolean;
}) => SetMetadata('swagger/apiBody', options);

export const ApiHeader = (options: {
  name: string;
  description?: string;
  required?: boolean;
}) => SetMetadata('swagger/apiHeader', options);

export const ApiBearerAuth = () => SetMetadata('swagger/apiBearerAuth', true);

export const ApiBasicAuth = () => SetMetadata('swagger/apiBasicAuth', true);

export const ApiOAuth2 = (options: { scopes: string[] }) =>
  SetMetadata('swagger/apiOAuth2', options);

export const ApiCookieAuth = () => SetMetadata('swagger/apiCookieAuth', true);

export const ApiExtraModels = (...models: any[]) =>
  SetMetadata('swagger/apiExtraModels', models);

export const ApiHideProperty = () =>
  SetMetadata('swagger/apiHideProperty', true);

export const ApiProperty = (options: {
  type?: any;
  description?: string;
  required?: boolean;
  default?: any;
  enum?: any[];
  example?: any;
  format?: string;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: boolean;
  exclusiveMaximum?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  multipleOf?: number;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  minProperties?: number;
  maxProperties?: number;
  additionalProperties?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  nullable?: boolean;
  deprecated?: boolean;
}) => SetMetadata('swagger/apiProperty', options);
