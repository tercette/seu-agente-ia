import mongoose, { Document, Schema } from "mongoose";

// Interface
interface Agent extends Document {
  userId: mongoose.Types.ObjectId;
  businessName: string;
  description: string;
  objective: string;
  supportContact: string;
  website: string;
  phoneNumber: string;
  openaiResponse?: string;
}

// Schema
const agentSchema = new Schema<Agent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    businessName: { type: String, required: [true, "Nome do Negócio é obrigatório"] },
    description: { type: String, required: [true, "O que sua empresa faz? é obrigatório"] },
    objective: { type: String, required: [true, "Qual seu principal objetivo? é obrigatório"] },
    supportContact: { type: String, required: [true, "Contato de Suporte é obrigatório"] },
    website: {
      type: String,
      required: [true, "Website é obrigatório"],
      validate: {
        validator: (v: string) => /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(v),
        message: "URL inválida",
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "Telefone é obrigatório"],
      validate: {
        validator: (v: string) => /^\d{11}$/.test(v),
        message: "Telefone inválido, insira um número válido sem espaços ou caracteres especiais",
      },
    },
    openaiResponse: { type: String, required: false },
  },
  { timestamps: true }
);

// Model
const AgentModel =
  mongoose.models.Agent || mongoose.model<Agent>("Agent", agentSchema);

export default AgentModel;