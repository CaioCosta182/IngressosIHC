'use client';
import { useState, use } from 'react';
import { useStore } from '../../../store/useStore';
import { EVENTOS_MOCK } from '../../../data/mock';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

export default function EventoPage({ params }: any) {
  const { id } = use(params) as any;
  const router = useRouter();
  const evento = EVENTOS_MOCK.find((e: any) => e.id === Number(id));
  const { adicionarIngresso, meusIngressos } = useStore((state: any) => state);
  
  const [catAtual, setCatAtual] = useState('');
  const [selecao, setSelecao] = useState<{assento: number, categoria: string}[]>([]);
  const [status, setStatus] = useState<'selecao' | 'pagamento' | 'processando'>('selecao');

  if (!evento) return <div className="p-10 font-black text-black">EVENTO NÃO ENCONTRADO</div>;

  const total = selecao.reduce((acc, item) => acc + (evento.categorias.find(c => c.tipo === item.categoria)?.preco || 0), 0);

  const isOcupado = (num: number, categoria: string) => {
    const noMock = evento.assentosOcupados.includes(num);
    const jaVendido = meusIngressos.some((compra: any) => 
      compra.nomeEvento === evento.nome && 
      compra.detalhes.some((item: any) => item.assento === num && item.categoria === categoria)
    );
    return noMock || jaVendido;
  };

  const isEsgotado = (categoria: string) => {
    const assentos = [1,2,3,4,5,6,7,8,9,10,11,12];
    return assentos.every(n => isOcupado(n, categoria));
  };

  const handleFinalizar = () => {
    setStatus('processando');
    setTimeout(() => {
      adicionarIngresso({
        idCompra: Math.random().toString(36).substr(2, 9).toUpperCase(),
        nomeEvento: evento.nome,
        dataEvento: evento.data,
        detalhes: selecao,
        valorTotal: total,
        qrCode: `TICKET-${evento.nome}-${total}-${Date.now()}`
      });
      router.push('/perfil');
    }, 2000);
  };

  if (status === 'pagamento') {
    return (
      <main className="p-8 max-w-md mx-auto text-center bg-white min-h-screen text-black border-x-4 border-black">
        <h2 className="text-3xl font-black uppercase mb-6">Pagamento PIX</h2>
        <div className="p-6 border-4 border-black rounded-3xl bg-gray-50 mb-6">
          <QRCodeSVG value={`PIX-PAYMENT-R$${total}`} size={250} className="mx-auto" />
          <p className="mt-4 font-black text-2xl text-green-700">R$ {total},00</p>
        </div>
        <button onClick={handleFinalizar} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl border-4 border-black shadow-xl hover:bg-green-500 transition-colors">
          CONFIRMAR PAGAMENTO
        </button>
      </main>
    );
  }

  if (status === 'processando') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
        <div className="w-20 h-20 border-8 border-black border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <h2 className="text-3xl font-black uppercase">Validando Transação...</h2>
      </div>
    );
  }

  return (
    <main className="p-8 max-w-2xl mx-auto bg-white min-h-screen text-black">
      <button onClick={() => router.back()} className="border-4 border-black px-4 py-1 font-black mb-4 uppercase hover:bg-black hover:text-white transition-all">← Voltar</button>
      <h1 className="text-4xl font-black uppercase border-b-8 border-black mb-8">{evento.nome}</h1>
      <div className="space-y-8">
        <div className="flex gap-4">
          {evento.categorias.map((c: any) => {
            const esgotado = isEsgotado(c.tipo);
            return (
              <button 
                key={c.tipo} 
                disabled={esgotado}
                onClick={() => setCatAtual(c.tipo)} 
                className={`p-4 border-4 rounded-xl flex-1 font-black transition-all ${
                  esgotado ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-50' :
                  catAtual === c.tipo ? 'bg-black text-white border-black scale-105' : 
                  'bg-white text-black border-black shadow-[4px_4px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1'
                }`}
              >
                {esgotado ? 'ESGOTADO' : c.tipo.toUpperCase()}<br/>
                {!esgotado && `R$ ${c.preco}`}
              </button>
            );
          })}
        </div>
        {catAtual && (
          <div className="grid grid-cols-6 gap-3 border-4 border-black p-6 rounded-3xl bg-gray-50">
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => {
              const ocupado = isOcupado(n, catAtual);
              const selecionado = selecao.some(s => s.assento === n && s.categoria === catAtual);
              return (
                <button 
                  key={n} 
                  disabled={ocupado} 
                  onClick={() => selecionado ? setSelecao(selecao.filter(s => !(s.assento === n && s.categoria === catAtual))) : setSelecao([...selecao, {assento: n, categoria: catAtual}])}
                  className={`h-12 border-4 rounded font-black transition-transform ${
                    ocupado ? 'bg-red-600 text-white border-red-900 cursor-not-allowed' : 
                    selecionado ? 'bg-green-600 text-white border-black scale-110' : 
                    'bg-white border-black text-black hover:bg-gray-100'
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>
        )}
        <button 
          disabled={selecao.length === 0} 
          onClick={() => setStatus('pagamento')} 
          className="w-full bg-black text-white py-6 rounded-3xl font-black text-2xl border-4 border-black shadow-[10px_10px_0px_0px_black] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all disabled:opacity-10"
        >
          PROSSEGUIR PARA PAGAMENTO
        </button>
      </div>
    </main>
  );
}
