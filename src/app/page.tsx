'use client';
import { useStore } from '../store/useStore';
import { EVENTOS_MOCK } from '../data/mock';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, logout } = useStore((state: any) => state);
  const router = useRouter();

  useEffect(() => {
    if (!user || !user.loggedIn) router.push('/login');
  }, [user, router]);

  if (!user || !user.loggedIn) return null;

  return (
    <main className="p-8 max-w-6xl mx-auto bg-white min-h-screen text-black font-sans">
      <div className="flex justify-between items-center mb-12 border-b-8 border-black pb-6">
        <h1 className="text-6xl font-black uppercase tracking-tighter">Eventos IHC</h1>
        <div className="flex gap-4 items-center">
          <span className="font-black text-xl underline decoration-4 underline-offset-4 text-black">Olá, {user.name}!</span>
          <button onClick={() => router.push('/perfil')} className="bg-yellow-400 border-4 border-black px-4 py-2 font-black uppercase hover:bg-yellow-300 transition-colors text-black">Meu Perfil</button>
          <button onClick={logout} className="border-4 border-black px-4 py-2 font-black uppercase hover:bg-gray-100 transition-colors text-black">Sair</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
        {EVENTOS_MOCK.map((evento: any) => (
          <div key={evento.id} className="border-8 border-black p-8 rounded-[40px] bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] flex flex-col">
            <div className="relative mb-6">
              <img src={evento.imagem} className="w-full h-64 object-cover border-4 border-black rounded-[30px]" alt={evento.nome} />
              <div className="absolute bottom-4 left-4 bg-yellow-300 border-2 border-black px-4 py-1 font-black uppercase text-sm shadow-[4px_4px_0px_0px_black] text-black">
                {evento.local}
              </div>
            </div>
            
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-3xl font-black uppercase leading-tight">{evento.nome}</h2>
              <p className="font-black text-lg bg-black text-white px-3 py-1 rounded-lg">
                {new Date(evento.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </p>
            </div>

            <p className="text-gray-700 font-bold leading-relaxed mb-8 line-clamp-3 h-[4.5rem]">
              {evento.descricao}
            </p>

            <div className="mt-auto pt-6 border-t-4 border-dashed border-black flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-gray-500">A partir de</p>
                <p className="text-2xl font-black">R$ {Math.min(...evento.categorias.map((c:any) => c.preco))},00</p>
              </div>
              <button 
                onClick={() => router.push(`/evento/${evento.id}`)} 
                className="bg-black text-white py-4 px-8 rounded-2xl font-black text-xl border-4 border-black uppercase tracking-widest hover:bg-blue-700 active:translate-y-2 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]"
              >
                Garantir Vaga
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
