import * as z from "zod";

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, { message: t("emailRequired") })
      .email({ message: t("emailInvalid") }),
    password: z.string().min(6, { message: t("passwordMin") }),
  });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
