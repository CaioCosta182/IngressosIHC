'use client';
import { useStore } from '../../store/useStore';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

export default function PerfilPage() {
  const { user, meusIngressos } = useStore((state: any) => state);
  const router = useRouter();
  
  if (!user) return null;

  return (
    <main className="p-8 font-sans max-w-4xl mx-auto bg-white min-h-screen text-black">
      <div className="flex justify-between items-center mb-10 border-b-8 border-black pb-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Meus Ingressos</h1>
        <button onClick={() => router.push('/')} className="bg-black text-white px-6 py-2 rounded-lg font-black border-4 border-black hover:bg-gray-800 transition-colors">INÍCIO</button>
      </div>
      
      <div className="space-y-8">
        {[...meusIngressos].reverse().map((compra: any, i: number) => {
          // Lógica para extrair as categorias únicas desta compra específica
          const categoriasUnicas = Array.from(new Set(compra.detalhes?.map((d: any) => d.categoria) || []));
          const textoSetor = categoriasUnicas.length > 0 ? categoriasUnicas.join(' e ') : (compra.categoria || "N/A");

          return (
            <div key={i} className="border-4 border-black p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] gap-6">
              <div className="space-y-3 w-full">
                <h3 className="text-3xl font-black text-black uppercase leading-tight">{compra.nomeEvento}</h3>
                <p className="text-xl font-bold text-black italic underline decoration-2">{new Date(compra.dataEvento).toLocaleDateString()}</p>
                
                <div className="pt-4 space-y-2">
                  <p className="text-xl font-black uppercase">
                    SETOR: <span className="text-blue-700">{textoSetor.toUpperCase()}</span>
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xl font-black uppercase">ASSENTOS:</span>
                    {compra.detalhes && compra.detalhes.map((item: any, idx: number) => (
                      <span key={idx} className="bg-gray-200 px-2 py-1 rounded border-2 border-black font-black text-sm">
                        {item.assento} ({item.categoria})
                      </span>
                    ))}
                  </div>

                  <p className="text-2xl font-black bg-yellow-300 inline-block px-3 py-1 border-2 border-black mt-2">
                    TOTAL: R$ {compra.valorTotal || 0},00
                  </p>
                </div>
              </div>
              
              <div className="p-4 border-4 border-black rounded-2xl bg-white text-center flex flex-col items-center shrink-0">
                <p className="font-black text-xs mb-2 uppercase tracking-widest">Acesso Digital</p>
                <QRCodeSVG value={compra.qrCode || "SEM-DADOS"} size={140} />
                <p className="font-bold text-[10px] mt-3 bg-black text-white px-2 py-1 rounded w-full truncate max-w-[140px]">
                  {compra.idCompra}
                </p>
              </div>
            </div>
          );
        })}
        
        {meusIngressos.length === 0 && (
          <div className="text-center py-20 border-4 border-dashed border-gray-300 rounded-3xl">
            <p className="text-2xl font-black text-gray-400 uppercase tracking-widest">Nenhum ingresso encontrado</p>
          </div>
        )}
      </div>
    </main>
  );
}
