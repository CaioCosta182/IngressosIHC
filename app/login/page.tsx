'use client';
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [nome, setNome] = useState('');
  const login = useStore((state: any) => state.login);
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-sans">
      <div className="max-w-md w-full p-10 bg-gray-100 rounded-2xl border-4 border-black">
        <h2 className="text-4xl font-black text-center text-black mb-8 uppercase">Entrar</h2>
        <input 
          type="text" 
          placeholder="Digite seu nome" 
          className="w-full p-4 border-4 border-black rounded-lg mb-4 text-black font-bold placeholder-gray-600 bg-white"
          onChange={(e) => setNome(e.target.value)}
        />
        <button 
          onClick={() => { if(nome.length > 2) { login(nome); router.push('/'); } }}
          className="w-full bg-black text-white py-4 rounded-lg font-black text-xl hover:bg-gray-800"
        >
          ACESSAR SISTEMA
        </button>
      </div>
    </div>
  );
}
