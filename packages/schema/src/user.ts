import { z } from 'zod';

// User role enum
export const userRoleEnum = z.enum([
  'ADMIN',
  'MANAGER',
  'DEVELOPER',
  'DESIGNER',
  'STAKEHOLDER',
]);

export type UserRole = z.infer<typeof userRoleEnum>;

// Base schema for user data
export const userSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters'
  }),
  email: z.string().email({
    message: 'Please enter a valid email address'
  }),
  role: userRoleEnum.default('DEVELOPER'),
  skills: z.array(z.string()).optional(),
  avatar: z.string().url().optional(),
});

// Type inference
export type User = z.infer<typeof userSchema>;
