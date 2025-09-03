import { z } from "zod";
import { updateUserSchema } from "@/lib/validators";

export type UpdateUser = z.infer<typeof updateUserSchema>;
