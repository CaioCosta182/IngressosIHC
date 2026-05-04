'use client';
import { useState, use } from 'react';
import { useStore } from '../../../store/useStore';
import { EVENTOS_MOCK } from '../../../data/mock';
import { useRouter } from 'next/navigation';

export default function EventoPage({ params }: any) {
  const { id } = use(params) as any;
  const router = useRouter();
  const evento = EVENTOS_MOCK.find((e: any) => e.id === Number(id));
  const adicionarIngresso = useStore((state: any) => state.adicionarIngresso);

  const [categoriaSel, setCategoriaSel] = useState('');
  const [assentoSel, setAssentoSel] = useState(null as any);

  if (!evento) return <div className="p-10 text-center">Evento não encontrado.</div>;

  const handleCompra = () => {
    adicionarIngresso({
      nomeEvento: evento.nome,
      dataEvento: evento.data,
      categoria: categoriaSel,
      assento: assentoSel,
      qrCode: 'TICKET-' + Math.random()
    });
    router.push('/perfil');
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <button onClick={() => router.back()} className="text-indigo-600 mb-4 block">← Voltar</button>
        <h1 className="text-2xl font-bold mb-6">{evento.nome}</h1>
        
        <div className="space-y-6">
          <div>
            <p className="font-bold mb-2">Selecione a Categoria:</p>
            <div className="flex gap-4">
              {evento.categorias.map((c: any) => (
                <button key={c.tipo} onClick={() => setCategoriaSel(c.tipo)} className={`p-3 border rounded-lg flex-1 ${categoriaSel === c.tipo ? 'bg-indigo-100 border-indigo-600' : ''}`}>
                  {c.tipo} - R${c.preco}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-bold mb-2">Assento:</p>
            <div className="grid grid-cols-6 gap-2">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                <button key={n} onClick={() => setAssentoSel(n)} className={`p-2 border rounded ${assentoSel === n ? 'bg-green-500 text-white' : 'bg-white'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleCompra} disabled={!categoriaSel || !assentoSel} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold disabled:opacity-30">
            Confirmar Compra
          </button>
        </div>
      </div>
    </main>
  );
}
