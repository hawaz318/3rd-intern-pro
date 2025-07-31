import { z } from 'zod';

export const PostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  category: z.string(),
  tags: z.array(z.string())
});
