import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'openai'
import { connectMongo } from '@/lib/mongoose'
import Session from '@/models/Session'

const VERIFY_TOKEN = 'agentGPT123'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode']
    const token = req.query['hub.verify_token']
    const challenge = req.query['hub.challenge']

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge)
    } else {
      return res.status(403).send('Token inválido')
    }
  }

  if (req.method === 'POST') {
    console.log('📩 Evento recebido do WhatsApp:')
    console.dir(req.body, { depth: null })

    const entry = req.body.entry?.[0]
    const changes = entry?.changes?.[0]
    const message = changes?.value?.messages?.[0]
    const from = message?.from

    if (message?.type === 'text' && from) {
      const userMessage = message.text.body
      const now = new Date()

      // 🔹 Conecta com MongoDB e controla sessão
      await connectMongo()

      let session = await Session.findOne({ phone: from })

      if (!session) {
        session = await Session.create({
          phone: from,
          lastMessageAt: now,
          sessionStartedAt: now,
          isHibernating: false,
        })
      } else {
        const hours = (now.getTime() - session.sessionStartedAt.getTime()) / (1000 * 60 * 60)

        if (session.isHibernating) {
          console.log('⏸️ Sessão hibernada. Ignorando...')
          return res.status(200).send('HIBERNATING')
        }

        if (hours >= 4) {
          await Session.updateOne({ phone: from }, { isHibernating: true })
          console.log('🌙 Sessão entrou em hibernação após 4h')
          return res.status(200).send('NOW HIBERNATING')
        }

        await Session.updateOne({ phone: from }, { lastMessageAt: now })
      }

      // 🔹 GPT
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: userMessage }],
      })

      const gptReply = completion.choices[0].message.content
      console.log('🤖 Resposta do GPT:', gptReply)

      // 🔹 WhatsApp reply
      await fetch(`https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: from,
          text: { body: gptReply },
        }),
      })
    }

    return res.status(200).send('EVENT_RECEIVED')
  }

  return res.status(405).end()
}
