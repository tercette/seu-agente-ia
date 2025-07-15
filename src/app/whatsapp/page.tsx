'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useUnread } from '../context/UnreadContext';

interface Message {
    _id: string;
    phone: string;
    role: 'user' | 'assistant';
    text: string;
    name: string;
    createdAt: string;
}

export default function WhatsAppMessagesPage() {
    const { unreadByPhone, setUnreadByPhone } = useUnread();
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
    const router = useRouter();
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const lastMessageIdRef = useRef<string | null>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            const res = await fetch('/api/messages');
            const data: Message[] = await res.json();
            setMessages(data);
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const latestByPhone = new Map<string, Message>();

        messages.forEach((msg) => {
            const existing = latestByPhone.get(msg.phone);
            if (!existing || new Date(msg.createdAt) > new Date(existing.createdAt)) {
                latestByPhone.set(msg.phone, msg);
            }
        });

        setUnreadByPhone((prev) => {
            const updated = { ...prev };

            for (const [phone, lastMsg] of latestByPhone.entries()) {
                const isUnread =
                    lastMsg.role === 'user' &&
                    phone !== selectedPhone;

                if (isUnread && !updated[phone]) {
                    updated[phone] = true;
                }
            }

            return updated;
        });
    }, [messages, selectedPhone]);

    useEffect(() => {
        if (!selectedPhone) return;

        const conversation = messages
            .filter((msg) => msg.phone === selectedPhone)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        const lastMsg = conversation[conversation.length - 1];
        const newLastId = lastMsg?._id;

        if (newLastId && lastMessageIdRef.current !== newLastId) {
            lastMessageIdRef.current = newLastId;
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, selectedPhone]);

    useEffect(() => {
        if (!selectedPhone || messages.length === 0) return;

        const latestMsg = messages
            .filter((msg) => msg.phone === selectedPhone)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

        if (latestMsg?.role === 'user') {
            setUnreadByPhone((prev) => ({
                ...prev,
                [selectedPhone]: false,
            }));
        }
    }, [selectedPhone, JSON.stringify(messages)]);

    const contacts = Array.from(
        new Map(
            messages
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // pega nome mais recente
                .map((msg) => [msg.phone, { phone: msg.phone, name: msg.name || 'Contato' }])
        ).values()
    );

    const conversation = selectedPhone
        ? messages
            .filter((msg) => msg.phone === selectedPhone)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        : [];

    return (
        <div className="min-h-screen bg-slate-900 text-white flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-slate-700 p-4">
                <button
                    onClick={() => router.push('/')}
                    className="mb-4 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded text-white w-full"
                >
                    ⬅ Voltar para Home
                </button>
                <h2 className="text-lg font-bold mb-2">📱 Contatos</h2>
                <ul className="space-y-2">
                    {contacts.map((contact) => (
                        <li key={contact.phone} className="relative">
                            <button
                                className={`w-full text-left px-3 py-2 rounded relative ${selectedPhone === contact.phone
                                    ? 'bg-emerald-700'
                                    : 'hover:bg-slate-700'
                                    }`}
                                onClick={() => {
                                    setSelectedPhone(contact.phone);
                                    setUnreadByPhone(prev => ({
                                        ...prev,
                                        [contact.phone]: false,
                                    }));
                                }}
                            >
                                <p className="font-semibold">{contact.name}</p>
                                <p className="text-sm text-slate-400">{contact.phone}</p>

                                {unreadByPhone[contact.phone] && (
                                    <span className="absolute top-2 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Conversa */}
            <div className="flex-1 p-6 overflow-y-auto">
                {selectedPhone ? (
                    <>
                        {(() => {
                            const contact = messages.find((msg) => msg.phone === selectedPhone);
                            const name = contact?.name || 'Contato';
                            return (
                                <h2 className="text-xl font-bold mb-4">
                                    📞 Conversa com {name}
                                </h2>
                            );
                        })()}
                        <div className="space-y-4">
                            {conversation.map((msg) => (
                                <div
                                    key={msg._id}
                                    className={`p-3 rounded-lg max-w-xl ${msg.role === 'user' ? 'bg-green-700' : 'bg-blue-700'
                                        }`}
                                >
                                    <p className="text-sm text-slate-300 mb-1">
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>{msg.role === 'user' ? 'Cliente' : 'Agente'}:</strong> {msg.text}
                                    </p>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>
                    </>
                ) : (
                    <p className="text-slate-400">Selecione um contato para ver a conversa.</p>
                )}
            </div>
        </div>
    );
}
