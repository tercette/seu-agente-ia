import { Power } from 'lucide-react';

export function LogoutIconButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      
      className="w-8 h-8 rounded-full bg-[#1e1e1e] shadow-[inset_4px_4px_10px_#141414,inset_-4px_-4px_10px_#2a2a2a] 
                 flex items-center justify-center hover:brightness-125 transition-all"
    >
      <Power className="text-gray-400 w-6 h-6" />
    </button>
  );
}