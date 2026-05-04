'use client';
import { useState, use } from 'react';
import { useStore } from '../../../store/useStore';
import { EVENTOS_MOCK } from '../../../data/mock';
import { useRouter } from 'next/navigation';

export default function EventoPage({ params }: any) {
  const { id } = use(params) as any;
  const router = useRouter();
  const evento = EVENTOS_MOCK.find((e: any) => e.id === Number(id));
  const { adicionarIngresso, meusIngressos } = useStore((state: any) => state);
  
  const [cat, setCat] = useState('');
  const [assentosSel, setAssentosSel] = useState<number[]>([]);

  if (!evento) return <div className="p-10 text-black font-black">Evento não encontrado</div>;

  // Heurística #5: Prevenção de Erros - Filtra assentos já vendidos
  const assentosVendidos = meusIngressos.flatMap((compra: any) => 
    compra.nomeEvento === evento.nome ? compra.assentos : []
  );
  
  const todosOcupados = [...evento.assentosOcupados, ...assentosVendidos];

  const toggleAssento = (n: number) => {
    if (assentosSel.includes(n)) {
      setAssentosSel(assentosSel.filter(a => a !== n));
    } else {
      setAssentosSel([...assentosSel, n]);
    }
  };

  const handleCompra = () => {
    const valorTotal = assentosSel.length * (evento.categorias.find(c => c.tipo === cat)?.preco || 0);
    
    // Gera um único registro para a compra total
    adicionarIngresso({
      idCompra: Math.random().toString(36).substr(2, 9).toUpperCase(),
      nomeEvento: evento.nome,
      dataEvento: evento.data,
      categoria: cat,
      assentos: assentosSel,
      valorTotal: valorTotal,
      qrCode: `COMPRA-${id}-${assentosSel.join('-')}-TOTAL-R$${valorTotal}`
    });
    router.push('/perfil');
  };

  return (
    <main className="p-8 font-sans max-w-2xl mx-auto bg-white min-h-screen text-black">
      <button onClick={() => router.back()} className="text-black font-black mb-4 border-4 border-black px-4 py-2 uppercase">← VOLTAR</button>
      <h1 className="text-4xl font-black mb-6 text-black uppercase tracking-tighter border-b-8 border-black pb-2">{evento.nome}</h1>
      
      <div className="space-y-10">
        <div>
          <p className="font-black text-xl text-black mb-4 uppercase">1. Categoria (Texto em Preto):</p>
          <div className="flex gap-4">
            {evento.categorias.map((c: any) => (
              <button key={c.tipo} onClick={() => setCat(c.tipo)} 
                className={`p-6 border-4 rounded-2xl flex-1 font-black text-lg ${cat === c.tipo ? 'bg-black text-white' : 'bg-white text-black border-black'}`}>
                {c.tipo.toUpperCase()}<br/>R$ {c.preco}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-black text-xl text-black mb-4 uppercase">2. Assentos ({assentosSel.length} selecionados):</p>
          <div className="grid grid-cols-6 gap-3 border-4 border-black p-6 rounded-3xl bg-gray-50">
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].map(n => {
              const ocupado = todosOcupados.includes(n);
              const selecionado = assentosSel.includes(n);
              return (
                <button 
                  key={n} disabled={ocupado} onClick={() => toggleAssento(n)} 
                  className={`h-14 border-4 rounded-lg font-black text-xl ${
                    ocupado ? 'bg-red-600 text-white border-red-900' : 
                    selecionado ? 'bg-green-600 text-white border-black' : 'bg-white border-black text-black'
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        <button 
          disabled={!cat || assentosSel.length === 0}
          onClick={handleCompra}
          className="w-full bg-black text-white py-6 rounded-3xl font-black text-2xl border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,0.2)]"
        >
          FINALIZAR COMPRA TOTAL (R$ {assentosSel.length * (evento.categorias.find(c => c.tipo === cat)?.preco || 0)})
        </button>
      </div>
    </main>
  );
}
