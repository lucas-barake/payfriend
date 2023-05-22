import { type Prisma } from "@prisma/client";

export const inviteUserSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
} satisfies Prisma.UserSelect;
