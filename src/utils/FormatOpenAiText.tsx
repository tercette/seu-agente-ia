import React from 'react';
import type { JSX } from 'react';

export function formatOpenAIText(text: string): JSX.Element {
  if (!text) return <></>;

  // Remove a numeração do início de linha (ex: "1. ", "2.1 ", etc.)
  const cleanedText = text.replace(/^\s*\d+(\.\d+)?\s*[\.\-]?\s*/gm, '');

  // Divide em parágrafos por linhas em branco ou quebras de linha
  const paragraphs = cleanedText
    .split(/\n{2,}|\r?\n/g)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-3 text-slate-300">
      {paragraphs.map((p, index) => (
        <p key={index}>{p}</p>
      ))}
    </div>
  );
}
