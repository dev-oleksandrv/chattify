import { z } from "zod";

export const createRoomSchema = z.object({
  title: z.string().min(1).max(32),
});

export type CreateRoomSchemaType = z.infer<typeof createRoomSchema>;
