import {
  getUserInputSchema,
  getUserOutputSchema,
  updateUserInputSchema,
} from '@/modules/users/shared/users.schemas';
import { z } from 'zod';

export type GetUserInput = z.infer<typeof getUserInputSchema>;
export type GetUserOutput = z.infer<typeof getUserOutputSchema>;

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
export type UpdateUserOutput = z.infer<typeof getUserOutputSchema>;
