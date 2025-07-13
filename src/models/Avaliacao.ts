import mongoose, { Document, Schema } from "mongoose";

// Definir a interface para a Avaliação
interface Avaliacao extends Document {
  businessName: string;
  description: string;
  objective: string;
  supportContact: string;
  website: string;
  phoneNumber: string;
}

// Criar o Schema
const avaliacaoSchema = new Schema<Avaliacao>({
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
      validator: function (v: string) {
        return /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(v);
      },
      message: "URL inválida",
    },
  },
  phoneNumber: {
    type: String,
    required: [true, "Telefone é obrigatório"],
    validate: {
      validator: function (v: string) {
        return /^\d{11}$/.test(v);
      },
      message:
        "Telefone inválido, insira um número válido sem espaços ou caracteres especiais",
    },
  },
});

// Criar o modelo baseado no schema
const AvaliacaoModel =
  mongoose.models.Avaliacao ||
  mongoose.model<Avaliacao>("Avaliacao", avaliacaoSchema);

export default AvaliacaoModel;
