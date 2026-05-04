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

  if (!user) return <div className="p-10 text-center font-black text-black">CARREGANDO...</div>;

  const agora = new Date();
  const eventosFuturos = EVENTOS_MOCK
    .filter((e: any) => new Date(e.data) >= agora)
    .sort((a: any, b: any) => new Date(a.data).getTime() - new Date(b.data).getTime());

  return (
    <main className="min-h-screen bg-white p-8 font-sans text-black">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12 border-b-4 border-black pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Tickets IHC</h1>
          <p className="text-xl font-bold mt-1">OLÁ, {user.name.toUpperCase()}!</p>
        </div>
        <button 
          onClick={() => router.push('/perfil')}
          className="bg-black text-white px-8 py-3 rounded-full font-black text-lg hover:bg-gray-800 transition-all border-4 border-black"
        >
          MEU PERFIL
        </button>
      </header>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-black mb-8 uppercase bg-black text-white inline-block px-4 py-1">Eventos Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {eventosFuturos.map((evento: any) => (
            <div 
              key={evento.id} 
              className="group border-4 border-black rounded-3xl overflow-hidden bg-white hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
              onClick={() => router.push(`/evento/${evento.id}`)}
            >
              <div className="relative h-56 border-b-4 border-black">
                <img src={evento.imagem} alt={evento.nome} className="h-full w-full object-cover" />
                <div className="absolute bottom-4 left-4 bg-white border-2 border-black px-3 py-1 font-black text-sm">
                  {new Date(evento.data).toLocaleDateString('pt-BR')}
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-2xl font-black leading-none uppercase group-hover:text-blue-700">{evento.nome}</h3>
                <p className="text-lg font-bold text-black italic underline">{evento.local.toUpperCase()}</p>
                <div className="pt-4 flex justify-between items-center">
                  <span className="font-black text-sm tracking-widest uppercase">Disponível</span>
                  <span className="bg-black text-white px-4 py-2 font-black text-sm rounded-lg">COMPRAR →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
