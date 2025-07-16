import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import { connectMongo } from "@/lib/mongoose";
import Session from "@/models/Session";
import Message from "@/models/Message";

const VERIFY_TOKEN = "agentGPT123";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const HIBERNATION_ENABLED = process.env.ENABLE_HIBERNATION === "true";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Token inválido");
    }
  }

  if (req.method === "POST") {
    console.log("📩 Evento recebido do WhatsApp:");
    console.dir(req.body, { depth: null });

    // 🔹 Sempre conectar antes de qualquer operação
    await connectMongo();

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];
    const from = message?.from;
    const contact = changes?.value?.contacts?.[0];
    const contactName = contact?.profile?.name || "Desconhecido";
    const systemPrompt = `
Você é um agente de IA altamente treinado que representa o escritório Sarkis Advocacia.

Seu papel é fornecer respostas claras, objetivas e profissionais sobre o contrato de compra e venda do programa Minha Casa Minha Vida, especialmente na Faixa 2. Você deve usar uma linguagem que transmita segurança, empatia e conhecimento técnico, refletindo os valores da Sarkis Advocacia.

Caso o cliente solicite uma reunião ou deseje discutir algo mais detalhado, você deve oferecer a opção de agendar uma consulta com a equipe da empresa. Para casos mais específicos ou complexos, encaminhe a solicitação ao responsável Felipe, garantindo um suporte completo.

Você está conectado ao sistema de CRM da empresa, podendo utilizar o histórico de interações e dados do cliente para personalizar ainda mais a conversa.

Seu objetivo é criar uma experiência interativa, personalizada e de alto nível para os clientes, reforçando o profissionalismo e o comprometimento da Sarkis Advocacia com um atendimento de excelência.
`;

    if (message?.type === "text" && from) {
      const userMessage = message.text.body;
      const now = new Date();

      await Message.create({
        phone: from,
        role: "user",
        text: userMessage,
        name: contactName,
      });

      let session = await Session.findOne({ phone: from });

      if (!session) {
        session = await Session.create({
          phone: from,
          lastMessageAt: now,
          sessionStartedAt: now,
          isHibernating: false,
        });
      } else {
        const hours =
          (now.getTime() - session.sessionStartedAt.getTime()) /
          (1000 * 60 * 60);

        if (HIBERNATION_ENABLED && session.isHibernating) {
          console.log("⏸️ Sessão hibernada. Ignorando...");
          return res.status(200).send("HIBERNATING");
        }

        await Session.updateOne({ phone: from }, { lastMessageAt: now });
      }

      

const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ],
});

      const gptReply = completion.choices[0].message.content;
      console.log("🤖 Resposta do GPT:", gptReply);

      await Message.create({
        phone: from,
        role: "assistant",
        text: gptReply,
        name: contactName
      });

      await fetch(
        `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: { body: gptReply },
          }),
        }
      );
    }

    return res.status(200).send("EVENT_RECEIVED");
  }

  return res.status(405).end();
}
