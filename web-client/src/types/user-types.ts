import type { RegisterUserSchemaType } from '../schemas/user-validation';

export interface RegisterUserRequestDto extends Omit<RegisterUserSchemaType, 'confirmPassword'> {}
