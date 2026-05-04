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
    <main className="min-h-screen bg-white p-8 font-sans">
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">Tickets IHC</h1>
        <button onClick={() => router.push('/perfil')} className="bg-black text-white px-4 py-2 rounded">Perfil</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {EVENTOS_MOCK.map((evento: any) => (
          <div key={evento.id} className="border p-4 rounded shadow-sm cursor-pointer" onClick={() => router.push(`/evento/${evento.id}`)}>
            <img src={evento.imagem} className="h-40 w-full object-cover mb-4" />
            <h3 className="font-bold">{evento.nome}</h3>
            <p className="text-blue-600 mt-2">Comprar Ingressos</p>
          </div>
        ))}
      </div>
    </main>
  );
}
