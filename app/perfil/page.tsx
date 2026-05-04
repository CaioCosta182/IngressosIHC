'use client';
import { useStore } from '../../store/useStore';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

export default function PerfilPage() {
  const { user, meusIngressos } = useStore((state: any) => state);
  const router = useRouter();
  if (!user) return null;

  const agora = new Date();
  const futuros = meusIngressos.filter((c: any) => new Date(c.dataEvento) >= agora);
  const passados = meusIngressos.filter((c: any) => new Date(c.dataEvento) < agora || c.nomeEvento === 'Festival de Inverno 2024');

  const CardTicket = ({ compra, expirado }: any) => {
    return (
      <div className={`border-4 border-black p-8 rounded-3xl bg-white shadow-[12px_12px_0px_0px_black] mb-8 ${expirado ? 'opacity-50 grayscale' : ''}`}>
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4 flex-1">
            <h3 className="text-3xl font-black uppercase leading-none">{compra.nomeEvento}</h3>
            <p className="text-xl font-bold italic underline">{new Date(compra.dataEvento).toLocaleDateString()} - {new Date(compra.dataEvento).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}h</p>
            
            <div className="grid grid-cols-1 gap-2 border-y-2 border-black py-4">
              {compra.detalhes?.map((d: any, idx: number) => (
                <div key={idx} className="flex justify-between font-black text-lg">
                  <span>ASSENTO {d.assento}</span>
                  <span className="text-blue-700">{d.categoria.toUpperCase()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-black uppercase text-green-700">● Pagamento via PIX/Cartão Confirmado</p>
              <p className="text-2xl font-black bg-yellow-300 inline-block px-2 border-2 border-black">TOTAL: R$ {compra.valorTotal},00</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 border-4 border-black rounded-2xl bg-white shrink-0">
            <p className="font-black text-xs mb-3 tracking-widest uppercase">Validar na Entrada</p>
            <QRCodeSVG value={compra.qrCode} size={150} />
            <p className="font-bold text-[10px] mt-3 uppercase tracking-tighter">{compra.idCompra}</p>
          </div>
        </div>

        {!expirado && (
          <div className="mt-8 p-4 bg-gray-100 border-2 border-black rounded-xl">
            <p className="font-black text-sm uppercase mb-2 underline">Como proceder na entrada:</p>
            <ul className="text-xs font-bold space-y-1 uppercase">
              <li>1. Apresente este QR Code na tela do celular para o fiscal.</li>
              <li>2. Tenha em mãos um documento oficial com foto.</li>
              <li>3. O acesso é individual por assento descrito no ticket.</li>
              <li>4. Chegue com 30 minutos de antecedência ao local.</li>
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="p-8 max-w-4xl mx-auto bg-white min-h-screen text-black font-sans">
      <div className="flex justify-between items-center mb-10 border-b-8 border-black pb-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Carteira de Ingressos</h1>
        <button onClick={() => router.push('/')} className="bg-black text-white px-8 py-3 rounded-xl font-black border-4 border-black uppercase hover:bg-gray-800 transition-all">Voltar</button>
      </div>

      <h2 className="text-xl font-black mb-8 uppercase bg-black text-white inline-block px-6 py-2 border-2 border-black shadow-[4px_4px_0px_0px_black]">Próximos Eventos</h2>
      <div className="mb-16">
        {futuros.map((c: any, i: number) => <CardTicket key={i} compra={c} />)}
        {futuros.length === 0 && <p className="text-center py-10 font-black border-4 border-dashed border-gray-300 text-gray-400">NENHUM INGRESSO ATIVO</p>}
      </div>

      <h2 className="text-xl font-black mb-8 uppercase bg-gray-400 text-white inline-block px-6 py-2 border-2 border-black shadow-[4px_4px_0px_0px_black]">Histórico de Eventos</h2>
      <div>
        {passados.map((c: any, i: number) => <CardTicket key={i} compra={c} expirado={true} />)}
      </div>
    </main>
  );
}
