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
  
  const [catAtual, setCatAtual] = useState('');
  const [selecao, setSelecao] = useState<{assento: number, categoria: string}[]>([]);

  if (!evento) return <div className="p-10 text-black font-black">Evento não encontrado</div>;

  // Heurística #5: Prevenção de Erros - Bloqueio real de assentos vendidos
  const isOcupado = (num: number, categoria: string) => {
    // 1. Verifica no Mock estático
    const noMock = evento.assentosOcupados.includes(num) && categoria === 'Pista'; // Exemplo mock
    
    // 2. Verifica em todas as compras realizadas nesta sessão
    const jaVendido = meusIngressos.some((compra: any) => 
      compra.nomeEvento === evento.nome && 
      compra.detalhes.some((item: any) => item.assento === num && item.categoria === categoria)
    );
    
    return noMock || jaVendido;
  };

  const toggleAssento = (num: number) => {
    const index = selecao.findIndex(item => item.assento === num && item.categoria === catAtual);
    if (index > -1) {
      setSelecao(selecao.filter((_, i) => i !== index));
    } else {
      setSelecao([...selecao, { assento: num, categoria: catAtual }]);
    }
  };

  const calcularTotal = () => {
    return selecao.reduce((acc, item) => {
      const preco = evento.categorias.find(c => c.tipo === item.categoria)?.preco || 0;
      return acc + preco;
    }, 0);
  };

  const handleCompra = () => {
    const total = calcularTotal();
    adicionarIngresso({
      idCompra: Math.random().toString(36).substr(2, 9).toUpperCase(),
      nomeEvento: evento.nome,
      dataEvento: evento.data,
      detalhes: selecao, // Guarda a lista de objetos {assento, categoria}
      assentos: selecao.map(s => `${s.assento} (${s.categoria})`),
      valorTotal: total,
      qrCode: `TICKET-${evento.nome}-${selecao.length}-ITENS-TOTAL-R$${total}`
    });
    router.push('/perfil');
  };

  return (
    <main className="p-8 font-sans max-w-2xl mx-auto bg-white min-h-screen text-black">
      <button onClick={() => router.back()} className="text-black font-black mb-4 border-4 border-black px-4 py-2 uppercase">← VOLTAR</button>
      <h1 className="text-4xl font-black mb-6 text-black uppercase tracking-tighter border-b-8 border-black pb-2">{evento.nome}</h1>
      
      <div className="space-y-8">
        <div>
          <p className="font-black text-xl text-black mb-4 uppercase underline">1. Escolha a Seção:</p>
          <div className="flex gap-4">
            {evento.categorias.map((c: any) => (
              <button key={c.tipo} onClick={() => setCatAtual(c.tipo)} 
                className={`p-4 border-4 rounded-xl flex-1 font-black ${catAtual === c.tipo ? 'bg-black text-white' : 'bg-white text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
                {c.tipo.toUpperCase()}<br/>R$ {c.preco}
              </button>
            ))}
          </div>
        </div>

        {catAtual && (
          <div className="border-4 border-black p-6 rounded-3xl bg-gray-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black text-lg mb-4 uppercase text-center border-b-2 border-black pb-2">Mapa: {catAtual}</p>
            <div className="grid grid-cols-6 gap-3">
              {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].map(n => {
                const ocupado = isOcupado(n, catAtual);
                const selecionado = selecao.some(s => s.assento === n && s.categoria === catAtual);
                return (
                  <button 
                    key={n} 
                    disabled={ocupado} 
                    onClick={() => toggleAssento(n)} 
                    className={`h-12 border-4 rounded font-black text-lg transition-all ${
                      ocupado ? 'bg-red-600 text-white border-red-900 cursor-not-allowed' : 
                      selecionado ? 'bg-green-600 text-white border-black scale-105 shadow-md' : 'bg-white border-black text-black hover:bg-yellow-200'
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-black text-xl uppercase mb-3 border-b-2 border-black">Resumo da Compra:</p>
          {selecao.length > 0 ? (
            <div className="space-y-2">
              {selecao.map((s, i) => (
                <div key={i} className="flex justify-between font-bold text-black border-b border-dashed border-gray-400 pb-1">
                  <span>ASSENTO {s.assento} ({s.categoria})</span>
                  <span>R$ {evento.categorias.find(c => c.tipo === s.categoria)?.preco}</span>
                </div>
              ))}
              <p className="pt-4 text-3xl font-black text-black text-right">TOTAL: R$ {calcularTotal()},00</p>
            </div>
          ) : (
            <p className="italic font-bold text-gray-500">Nenhum assento selecionado no momento.</p>
          )}
        </div>

        <button 
          disabled={selecao.length === 0}
          onClick={handleCompra}
          className="w-full bg-black text-white py-6 rounded-3xl font-black text-2xl border-4 border-black uppercase shadow-[10px_10px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-1 transition-all disabled:opacity-10"
        >
          Finalizar Pedido ({selecao.length} itens)
        </button>
      </div>
    </main>
  );
}
