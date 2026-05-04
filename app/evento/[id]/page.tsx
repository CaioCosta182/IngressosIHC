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

  if (!evento) return <div className="p-10 font-black">EVENTO NÃO ENCONTRADO</div>;

  const total = selecao.reduce((acc, item) => acc + (evento.categorias.find(c => c.tipo === item.categoria)?.preco || 0), 0);

  const isOcupado = (num: number, categoria: string) => {
    const noMock = evento.assentosOcupados.includes(num);
    const jaVendido = meusIngressos.some((compra: any) => 
      compra.nomeEvento === evento.nome && 
      compra.detalhes.some((item: any) => item.assento === num && item.categoria === categoria)
    );
    return noMock || jaVendido;
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
      <main className="p-8 max-w-md mx-auto text-center bg-white min-h-screen border-x-4 border-black">
        <h2 className="text-3xl font-black uppercase mb-6">Pagamento PIX</h2>
        <div className="p-6 border-4 border-black rounded-3xl bg-gray-50 mb-6">
          <QRCodeSVG value={`PIX-PAYMENT-R$${total}`} size={250} className="mx-auto" />
          <p className="mt-4 font-black text-2xl text-green-700">R$ {total},00</p>
        </div>
        <p className="font-bold mb-8 uppercase text-sm">Escaneie o código acima para confirmar sua compra de {selecao.length} ingressos.</p>
        <button onClick={handleFinalizar} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl border-4 border-black animate-bounce shadow-xl">
          JÁ PAGUEI / CONFIRMAR
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
      <button onClick={() => router.back()} className="border-4 border-black px-4 py-1 font-black mb-4 uppercase">← Voltar</button>
      <h1 className="text-4xl font-black uppercase border-b-8 border-black mb-8">{evento.nome}</h1>
      
      <div className="space-y-8">
        <div className="flex gap-4">
          {evento.categorias.map((c: any) => (
            <button key={c.tipo} onClick={() => setCatAtual(c.tipo)} 
              className={`p-4 border-4 rounded-xl flex-1 font-black ${catAtual === c.tipo ? 'bg-black text-white' : 'bg-white text-black border-black shadow-[4px_4px_0px_0px_black]'}`}>
              {c.tipo.toUpperCase()}<br/>R$ {c.preco}
            </button>
          ))}
        </div>

        {catAtual && (
          <div className="grid grid-cols-6 gap-3 border-4 border-black p-6 rounded-3xl">
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => {
              const ocupado = isOcupado(n, catAtual);
              const selecionado = selecao.some(s => s.assento === n && s.categoria === catAtual);
              return (
                <button key={n} disabled={ocupado} onClick={() => selecionado ? setSelecao(selecao.filter(s => !(s.assento === n && s.categoria === catAtual))) : setSelecao([...selecao, {assento: n, categoria: catAtual}])}
                  className={`h-12 border-4 rounded font-black ${ocupado ? 'bg-red-600 text-white border-red-900' : selecionado ? 'bg-green-600 text-white' : 'bg-white'}`}>
                  {n}
                </button>
              );
            })}
          </div>
        )}

        <button disabled={selecao.length === 0} onClick={() => setStatus('pagamento')} className="w-full bg-black text-white py-6 rounded-3xl font-black text-2xl border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,0.3)] disabled:opacity-10">
          PROSSEGUIR PARA PAGAMENTO
        </button>
      </div>
    </main>
  );
}
