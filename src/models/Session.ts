import mongoose, { Document, Schema } from 'mongoose'

export interface SessionDocument extends Document {
  phone: string
  lastMessageAt: Date
  sessionStartedAt: Date
  isHibernating: boolean
}

const SessionSchema = new Schema<SessionDocument>({
  phone: { type: String, required: true, unique: true },
  lastMessageAt: { type: Date, required: true },
  sessionStartedAt: { type: Date, required: true },
  isHibernating: { type: Boolean, default: false },
})

export default mongoose.models.Session || mongoose.model<SessionDocument>('Session', SessionSchema)