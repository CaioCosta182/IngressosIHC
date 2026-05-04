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
  const [status, setStatus] = useState<'selecao' | 'pagamento' | 'processando' | 'sucesso'>('selecao');
  const [email, setEmail] = useState('');

  if (!evento) return <div className="p-10 font-bold">EVENTO NÃO ENCONTRADO</div>;

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

  const finalizarFluxo = () => {
    adicionarIngresso({
      idCompra: Math.random().toString(36).substr(2, 9).toUpperCase(),
      nomeEvento: evento.nome,
      dataEvento: evento.data,
      detalhes: selecao,
      valorTotal: total,
      qrCode: `TICKET-${evento.nome}-${total}-${Date.now()}`
    });
    router.push('/perfil');
  };

  if (status === 'sucesso') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 font-sans">
        <div className="bg-white border-4 border-black p-8 rounded-[32px] max-w-sm w-full shadow-[15px_15px_0px_0px_white]">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black shadow-[4px_4px_0px_0px_black]">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-2xl font-black uppercase text-black">Pagamento Aprovado</h2>
          </div>

          <div className="bg-gray-100 p-5 rounded-2xl border-2 border-black mb-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-gray-500">Evento</span>
              <span className="text-xs font-black text-black">{evento.nome}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-gray-500">Ingressos</span>
              <span className="text-xs font-black text-black">{selecao.length} unidade(s)</span>
            </div>
            <div className="flex justify-between items-center border-t-2 border-dashed border-gray-400 pt-2">
              <span className="text-[10px] font-black uppercase text-gray-500">Total Pago</span>
              <span className="text-lg font-black text-green-700">R$ {total},00</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 ml-1">E-mail para envio:</label>
              <input 
                type="email" 
                placeholder="seu@email.com" 
                className="w-full p-4 border-2 border-black rounded-xl font-bold text-black outline-none focus:ring-4 focus:ring-yellow-400 transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button 
              onClick={finalizarFluxo}
              className="w-full bg-black text-white py-4 rounded-xl font-black text-lg border-2 border-black uppercase tracking-tighter hover:bg-gray-800 transition-colors"
            >
              CONCLUIR E ACESSAR
            </button>
            
            {email && (
              <p className="bg-blue-50 text-blue-800 text-[10px] font-black p-2 rounded-lg border-2 border-blue-200 text-center uppercase animate-fade-in mt-4">
                ✓ Enviamos uma cópia para: {email}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (status === 'pagamento') {
    return (
      <main className="p-8 max-w-md mx-auto bg-white min-h-screen text-black font-sans border-x-4 border-black">
        <h2 className="text-3xl font-black uppercase mb-2">Finalizar Pedido</h2>
        <p className="text-xs font-bold text-gray-500 uppercase mb-8 italic">Expira em 10:00 minutos</p>

        <div className="border-4 border-black p-6 rounded-3xl bg-white mb-8 shadow-[8px_8px_0px_0px_black]">
          <QRCodeSVG value={`PIX-PAYMENT-R$${total}`} size={200} className="mx-auto border-4 border-gray-100 p-2" />
          <div className="mt-6 bg-gray-100 p-4 rounded-xl border-2 border-black">
            <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Valor a pagar no PIX</p>
            <p className="text-3xl font-black text-green-700">R$ {total},00</p>
          </div>
        </div>

        <div className="text-left space-y-4 mb-8">
          <h4 className="font-black uppercase text-sm border-b-2 border-black pb-1 inline-block">Como pagar:</h4>
          <ol className="text-xs font-bold space-y-2 text-gray-700 uppercase">
            <li className="flex gap-2"><span>1.</span> Acesse seu app de pagamentos ou banco.</li>
            <li className="flex gap-2"><span>2.</span> Escolha a opção de pagar via QR Code.</li>
            <li className="flex gap-2"><span>3.</span> Escaneie o código acima e confirme os dados.</li>
          </ol>
        </div>

        <button 
          onClick={() => { setStatus('processando'); setTimeout(() => setStatus('sucesso'), 2000); }} 
          className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl border-4 border-black shadow-[6px_6px_0px_0px_black] hover:bg-green-500 active:translate-y-1 transition-all uppercase"
        >
          CONFIRMAR PAGAMENTO
        </button>
        <button onClick={() => setStatus('selecao')} className="mt-4 text-[10px] font-black uppercase underline decoration-2">Cancelar e voltar</button>
      </main>
    );
  }

  if (status === 'processando') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black font-sans">
        <div className="w-16 h-16 border-8 border-black border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <h2 className="text-2xl font-black uppercase tracking-tighter">Validando PIX...</h2>
      </div>
    );
  }

  return (
    <main className="p-8 max-w-2xl mx-auto bg-white min-h-screen text-black font-sans">
      <button onClick={() => router.back()} className="border-2 border-black px-4 py-1 font-bold mb-4 uppercase hover:bg-black hover:text-white transition-all">← Voltar</button>
      <h1 className="text-3xl font-black uppercase border-b-4 border-black mb-6">{evento.nome}</h1>
      <div className="space-y-6">
        <div className="flex gap-2">
          {evento.categorias.map((c: any) => {
            const esgotado = isEsgotado(c.tipo);
            return (
              <button key={c.tipo} disabled={esgotado} onClick={() => setCatAtual(c.tipo)} 
                className={`p-3 border-2 rounded-lg flex-1 font-bold transition-all ${esgotado ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : catAtual === c.tipo ? 'bg-black text-white' : 'bg-white text-black border-black shadow-[3px_3px_0px_0px_black]'}`}>
                {esgotado ? 'LOTADO' : `${c.tipo}\nR$ ${c.preco}`}
              </button>
            );
          })}
        </div>
        {catAtual && (
          <div className="grid grid-cols-6 gap-2 border-2 border-black p-4 rounded-xl bg-gray-50">
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => {
              const ocupado = isOcupado(n, catAtual);
              const selecionado = selecao.some(s => s.assento === n && s.categoria === catAtual);
              return (
                <button key={n} disabled={ocupado} onClick={() => selecionado ? setSelecao(selecao.filter(s => !(s.assento === n && s.categoria === catAtual))) : setSelecao([...selecao, {assento: n, categoria: catAtual}])}
                  className={`h-10 border-2 rounded font-bold ${ocupado ? 'bg-red-500 text-white cursor-not-allowed' : selecionado ? 'bg-green-500 text-white border-black' : 'bg-white border-gray-300 hover:border-black'}`}>
                  {n}
                </button>
              );
            })}
          </div>
        )}
        <button disabled={selecao.length === 0} onClick={() => setStatus('pagamento')} className="w-full bg-black text-white py-4 rounded-xl font-bold text-xl border-2 border-black shadow-[6px_6px_0px_0px_black] disabled:opacity-30">
          PROSSEGUIR
        </button>
      </div>
    </main>
  );
}
