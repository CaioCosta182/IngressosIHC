'use client';
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [nome, setNome] = useState('');
  const login = useStore((state: any) => state.login);
  const router = useRouter();

  const handleLogin = () => {
    if(nome.trim().length > 2) {
      login(nome);
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-sans p-6 text-black">
      <div className="max-w-md w-full p-10 bg-gray-100 rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_black]">
        <h2 className="text-4xl font-black text-center mb-8 uppercase tracking-tighter">Entrar</h2>
        <input 
          type="text" 
          placeholder="Seu nome aqui..." 
          autoFocus
          className="w-full p-4 border-4 border-black rounded-xl mb-6 font-bold bg-white outline-none focus:ring-4 focus:ring-yellow-400 transition-all"
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
        <button 
          onClick={handleLogin}
          className="w-full bg-black text-white py-5 rounded-2xl font-black text-xl border-4 border-black uppercase tracking-widest transition-transform hover:scale-105 active:translate-y-2 shadow-[10px_10px_0px_0px_black] hover:shadow-[15px_15px_0px_0px_black]"
        >
          ACESSAR (ENTER)
        </button>
      </div>
    </div>
  );
}
