'use client';

import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

export default function PerfilPage() {
  const { user, meusIngressos, logout } = useStore();
  const router = useRouter();

  if (!user) return null;

  const agora = new Date();
  const ingressosAtivos = meusIngressos.filter(i => new Date(i.dataEvento) >= agora);
  const ingressosPassados = meusIngressos.filter(i => new Date(i.dataEvento) < agora);

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Meus Ingressos</h1>
          <div className="flex gap-2">
            <button onClick={() => router.push('/')} className="bg-white px-4 py-2 rounded-lg shadow text-sm">Início</button>
            <button onClick={() => { logout(); router.push('/login'); }} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold">Sair</button>
          </div>
        </header>

        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-600 italic">Próximos Eventos</h2>
          {ingressosAtivos.length === 0 && <p className="text-gray-400">Nenhum ingresso ativo.</p>}
          {ingressosAtivos.map((ticket, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-indigo-500 flex flex-wrap md:flex-nowrap gap-6 items-center">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{ticket.nomeEvento}</h3>
                <p className="text-gray-500">{new Date(ticket.dataEvento).toLocaleString('pt-BR')}</p>
                <div className="mt-2 flex gap-4 text-sm font-medium">
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded">{ticket.categoria}</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">Assento: {ticket.assento}</span>
                </div>
              </div>
              <div className="bg-white p-2 border-2 border-dashed rounded-lg">
                <QRCodeSVG value={ticket.qrCode} size={80} />
                <p className="text-[10px] text-center mt-1 font-mono">{ticket.idCompra}</p>
              </div>
            </div>
          ))}

          {ingressosPassados.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-gray-400 italic pt-10">Eventos Passados</h2>
              {ingressosPassados.map((ticket, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl opacity-60 grayscale flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{ticket.nomeEvento}</h3>
                    <p className="text-xs">{new Date(ticket.dataEvento).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs font-bold uppercase">Expirado</span>
                </div>
              ))}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
