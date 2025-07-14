import mongoose, { Document, Schema } from "mongoose";

// Interface
interface Avaliacao extends Document {
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
const avaliacaoSchema = new Schema<Avaliacao>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    businessName: {
      type: String,
      required: [true, "Nome do Negócio é obrigatório"],
    },
    description: {
      type: String,
      required: [true, "O que sua empresa faz? é obrigatório"],
    },
    objective: {
      type: String,
      required: [true, "Qual seu principal objetivo? é obrigatório"],
    },
    supportContact: {
      type: String,
      required: [true, "Contato de Suporte é obrigatório"],
    },
    website: {
      type: String,
      required: [true, "Website é obrigatório"],
      validate: {
        validator: (v: string) =>
          /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(v),
        message: "URL inválida",
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "Telefone é obrigatório"],
      validate: {
        validator: (v: string) => /^\d{11}$/.test(v),
        message:
          "Telefone inválido, insira um número válido sem espaços ou caracteres especiais",
      },
    },
    openaiResponse: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // para .sort({ createdAt: -1 })
  }
);

// Model
const AvaliacaoModel =
  mongoose.models.Avaliacao ||
  mongoose.model<Avaliacao>("Avaliacao", avaliacaoSchema);

export default AvaliacaoModel;