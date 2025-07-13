// src/app/page.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Seu Agente IA</h1>
      {session ? (
        <>
          <p>Olá, {session.user?.name}!</p>
          <button className="mt-4 bg-red-500 px-4 py-2 rounded text-white" onClick={() => signOut()}>
            Sair
          </button>
        </>
      ) : (
        <button className="bg-blue-600 px-4 py-2 rounded text-white" onClick={() => signIn("google")}>
          Entrar com Google
        </button>
      )}
    </main>
  );
}
