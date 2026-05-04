'use client';
import { useStore } from '../../store/useStore';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

export default function PerfilPage() {
  const { user, meusIngressos } = useStore((state: any) => state);
  const router = useRouter();
  
  if (!user || !user.loggedIn) return null;

  const agora = new Date();
  const historicoFicticio = [
    {
      idCompra: "HIST-001",
      nomeEvento: "WSI - Workshop de Sistemas",
      dataEvento: "2024-05-10T09:00:00",
      detalhes: [{ assento: 488, categoria: "Auditório IFMG" }],
      valorTotal: 0,
      qrCode: "WSI-2024"
    },
    {
      idCompra: "TCC-TESTE",
      nomeEvento: "Teste Plataforma Arena OBI (TCC)",
      dataEvento: "2025-11-20T14:00:00",
      detalhes: [{ assento: 50, categoria: "Laboratório" }],
      valorTotal: 0,
      qrCode: "TCC-2025"
    }
  ];

  const todos = [...meusIngressos, ...historicoFicticio];
  const futuros = todos.filter((c: any) => new Date(c.dataEvento) >= agora);
  const passados = todos.filter((c: any) => new Date(c.dataEvento) < agora);

  const CardTicket = ({ compra, expirado }: any) => (
    <div className={`border-4 border-black p-8 rounded-3xl bg-white shadow-[12px_12px_0px_0px_black] mb-8 ${expirado ? 'opacity-50 grayscale' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-3xl font-black uppercase leading-tight">{compra.nomeEvento}</h3>
              <p className="text-xl font-bold text-gray-700 italic">{new Date(compra.dataEvento).toLocaleDateString()} às {new Date(compra.dataEvento).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
            {!expirado && <span className="bg-green-100 text-green-800 text-xs font-black px-3 py-1 rounded-full border-2 border-green-800 uppercase">Confirmado</span>}
          </div>

          <div className="border-y-4 border-black py-4 space-y-2">
            {compra.detalhes?.map((d: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="font-black text-lg uppercase tracking-wider">Acesso: {d.categoria}</span>
                <span className="bg-black text-white px-3 py-1 font-black text-sm rounded">ASSENTO {d.assento}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Valor do Título</p>
              <p className="text-2xl font-black bg-yellow-300 inline-block px-3 py-1 border-2 border-black">R$ {compra.valorTotal},00</p>
            </div>
            <p className="text-[10px] font-bold text-right max-w-[200px] leading-tight text-gray-400">ESTE DOCUMENTO É UM COMPROVANTE NOMINAL DE ACESSO AO EVENTO MENCIONADO.</p>
          </div>
        </div>

        <div className="p-4 border-4 border-black rounded-2xl bg-white flex flex-col items-center justify-center shrink-0">
          <QRCodeSVG value={compra.qrCode} size={150} />
          <p className="font-black text-[11px] mt-3 tracking-widest text-black">{compra.idCompra}</p>
        </div>
      </div>

      {!expirado && (
        <div className="mt-8 p-5 bg-gray-50 border-2 border-black rounded-2xl">
          <h4 className="font-black text-xs uppercase mb-3 border-b-2 border-black pb-1 inline-block">Termos e Condições de Acesso</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="text-[10px] font-bold space-y-2 uppercase text-gray-700">
              <li>• Obrigatória a apresentação deste ticket digital e documento original com foto (RG ou CNH).</li>
              <li>• O acesso é intransferível e válido apenas para o assento e setor discriminados no título.</li>
            </ul>
            <ul className="text-[10px] font-bold space-y-2 uppercase text-gray-700">
              <li>• Recomenda-se a chegada ao recinto com antecedência mínima de 40 minutos para triagem.</li>
              <li>• A reprodução indevida deste código QR impossibilitará o acesso, invalidando o bilhete original.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <main className="p-8 max-w-4xl mx-auto bg-white min-h-screen text-black font-sans">
      <div className="flex justify-between items-center mb-10 border-b-8 border-black pb-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Carteira de Ingressos</h1>
        <button onClick={() => router.push('/')} className="bg-black text-white px-8 py-3 rounded-xl font-black border-4 border-black uppercase hover:invert transition-all">Voltar ao Início</button>
      </div>

      <h2 className="text-xl font-black mb-8 uppercase bg-black text-white inline-block px-6 py-2 border-2 border-black shadow-[4px_4px_0px_0px_black]">Ingressos Ativos</h2>
      <div className="mb-16">
        {futuros.map((c, i) => <CardTicket key={i} compra={c} expirado={false} />)}
        {futuros.length === 0 && <div className="text-center py-16 border-4 border-dashed border-gray-300 rounded-3xl font-black text-gray-400 uppercase">Nenhum ingresso ativo disponível</div>}
      </div>

      <h2 className="text-xl font-black mb-8 uppercase bg-gray-400 text-white inline-block px-6 py-2 border-2 border-black shadow-[4px_4px_0px_0px_black]">Histórico de Atividades</h2>
      <div>{passados.map((c, i) => <CardTicket key={i} compra={c} expirado={true} />)}</div>
    </main>
  );
}
