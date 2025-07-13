import { z } from "zod";

export const avaliacaoSchema = z.object({
  businessName: z.string().min(1, "Nome do Negócio é obrigatório"),
  description: z.string().min(1, "O que sua empresa faz? é obrigatório"),
  objective: z.string().min(1, "Qual seu principal objetivo? é obrigatório"),
  supportContact: z.string().min(1, "Contato de Suporte é obrigatório"),
   website: z.string()
    .min(1, 'Website é obrigatório')
    .regex(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/, 'URL inválida'), // Regex ajustado
  phoneNumber: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(
      /^\d{11}$/,
      "Telefone inválido, insira um número válido sem espaços ou caracteres especiais"
    ),
});
