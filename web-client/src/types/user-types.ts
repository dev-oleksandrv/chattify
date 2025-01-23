import type { LoginUserSchemaType, RegisterUserSchemaType } from '../schemas/user-validation';

export interface RegisterUserRequestDto extends Omit<RegisterUserSchemaType, 'confirmPassword'> {}

export interface LoginUserRequestDto extends LoginUserSchemaType {}
