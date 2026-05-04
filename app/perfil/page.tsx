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
        <h1 className="text-4xl font-black uppercase">Meus Ingressos</h1>
        <button onClick={() => router.push('/')} className="bg-black text-white px-6 py-2 rounded-lg font-black border-4 border-black">INÍCIO</button>
      </div>
      
      <div className="space-y-8">
        {meusIngressos.map((compra: any, i: number) => (
          <div key={i} className="border-4 border-black p-8 rounded-3xl flex justify-between items-center bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-black uppercase">{compra.nomeEvento}</h3>
              <p className="text-xl font-bold text-black italic underline">{new Date(compra.dataEvento).toLocaleDateString()}</p>
              <div className="pt-4 space-y-2">
                <p className="text-xl font-black">SETOR: {compra.categoria.toUpperCase()}</p>
                <p className="text-xl font-black">ASSENTOS: {compra.assentos.join(', ')}</p>
                <p className="text-2xl font-black bg-yellow-300 inline-block px-2">TOTAL: R$ {compra.valorTotal},00</p>
              </div>
            </div>
            <div className="p-4 border-4 border-black rounded-2xl bg-white text-center">
              <p className="font-black text-xs mb-2">QR CODE ÚNICO</p>
              <QRCodeSVG value={compra.qrCode} size={120} />
              <p className="font-bold text-xs mt-2">{compra.idCompra}</p>
            </div>
          </div>
        ))}
        {meusIngressos.length === 0 && <p className="text-2xl text-center font-black py-20 uppercase">Nenhum ingresso comprado.</p>}
      </div>
    </main>
  );
}
