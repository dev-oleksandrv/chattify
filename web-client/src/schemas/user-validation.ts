import { z } from 'zod';

export const registerUserSchema = z
	.object({
		email: z.string().email(),
		username: z.string().min(3).max(32),
		password: z.string().min(8).max(64),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	});

export type RegisterUserSchemaType = z.infer<typeof registerUserSchema>;
