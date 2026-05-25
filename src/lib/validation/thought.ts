import { z } from "zod";
import { ContentType } from "@/src/generated/prisma/enums";

export const CreateThoughtSchema = z.object({
    title: z.string().min(1, "Title or Summary is Required").max(200),
    description: z.string().optional(),
    url: z.url("Please provide a structurally valid URL"),
    type: z.enum(ContentType),
    tags: z.array(z.string().min(1).max(10, "Maximum of 10 tags per resource allowed"))

});

export type CreateThoughtInput = z.infer<typeof CreateThoughtSchema>