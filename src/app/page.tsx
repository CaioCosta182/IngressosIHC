'use client';
import { useStore } from '../store/useStore';
import { EVENTOS_MOCK } from '../data/mock';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const user = useStore((state: any) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) return <div className="p-10 text-center font-sans">Carregando...</div>;

  return (
    <main className="min-h-screen bg-gray-100 p-8 font-sans">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tickets IHC</h1>
          <p className="text-gray-600">Bem-vindo, {user.name}!</p>
        </div>
        <button onClick={() => router.push('/perfil')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-md">
          Meu Perfil
        </button>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {EVENTOS_MOCK.filter((e: any) => new Date(e.data) >= new Date()).map((evento: any) => (
          <div key={evento.id} className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all" onClick={() => router.push(`/evento/${evento.id}`)}>
            <img src={evento.imagem} alt={evento.nome} className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold">{evento.nome}</h3>
              <p className="text-indigo-600 font-bold mt-4 tracking-tight">Comprar Ingressos →</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
