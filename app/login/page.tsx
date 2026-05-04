'use client';
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [nome, setNome] = useState('');
  const login = useStore((state: any) => state.login);
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <div className="max-w-md w-full p-10 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Tickets IHC</h2>
        <input 
          type="text" 
          placeholder="Seu nome" 
          className="w-full p-3 border rounded-lg mb-4"
          onChange={(e) => setNome(e.target.value)}
        />
        <button 
          onClick={() => { login(nome); router.push('/'); }}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
