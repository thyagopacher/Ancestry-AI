
import React, { useState } from 'react';
import { generateFamilyTree } from './services/geminiService';
import FamilyTree from './components/FamilyTree';
import { SearchResult } from './types';

const App: React.FC = () => {
  const [name, setName] = useState('');
  const [father, setFather] = useState('');
  const [mother, setMother] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !father || !mother) return;

    setLoading(true);
    setError(null);
    try {
      const data = await generateFamilyTree(name, father, mother);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(
        "Dificuldade em encontrar registros específicos. Tente incluir sobrenomes completos ou verifique sua conexão com a internet."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-12 bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-700 to-violet-800 text-white py-14 px-4 shadow-xl mb-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black mb-4 flex items-center justify-center gap-4">
            <i className="fas fa-network-wired"></i> Ancestry AI
          </h1>
          <p className="text-indigo-100 text-xl font-light">
            Conectando gerações através de inteligência artificial e pesquisa histórica.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Sidebar Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 sticky top-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <i className="fas fa-leaf text-emerald-500"></i> Suas Raízes
                </h2>
                <p className="text-slate-500 text-sm mt-1">Insira os nomes completos para melhores resultados.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Seu Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-500 bg-slate-50 outline-none transition-all text-slate-900 font-medium"
                    placeholder="João Alberto da Silva"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Nome do seu Pai</label>
                  <input
                    type="text"
                    required
                    value={father}
                    onChange={(e) => setFather(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-500 bg-slate-50 outline-none transition-all text-slate-900 font-medium"
                    placeholder="Nome completo do pai"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Nome da sua Mãe</label>
                  <input
                    type="text"
                    required
                    value={mother}
                    onChange={(e) => setMother(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-500 bg-slate-50 outline-none transition-all text-slate-900 font-medium"
                    placeholder="Nome completo da mãe"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-black text-white text-lg transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 ${
                    loading ? 'bg-slate-300' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'
                  }`}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-circle-notch animate-spin text-xl"></i> Mapeando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic"></i> Gerar Árvore
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in">
                  <i className="fas fa-triangle-exclamation mt-1"></i>
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Visualization Area */}
          <div className="lg:col-span-2">
            {!result && !loading && (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] min-h-[500px] flex flex-col items-center justify-center text-slate-400 p-12 text-center shadow-inner">
                <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-8">
                  <i className="fas fa-book-atlas text-5xl text-indigo-200"></i>
                </div>
                <h3 className="text-2xl font-bold text-slate-700">Aguardando Descobertas</h3>
                <p className="max-w-md mt-4 text-slate-500 leading-relaxed">
                  Utilizamos o poder do Google Search para tentar localizar seus antepassados. 
                  Preencha os dados e prepare-se para ver sua história se formar.
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-white p-12 rounded-[2rem] shadow-2xl border border-slate-50 flex flex-col items-center justify-center min-h-[500px] space-y-8 animate-pulse">
                <div className="relative">
                  <div className="w-32 h-32 border-[12px] border-slate-100 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-32 h-32 border-[12px] border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fas fa-dna text-3xl text-indigo-600"></i>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-black text-slate-800 mb-3">Pesquisando sua história...</h3>
                  <div className="flex flex-col gap-2">
                    <p className="text-indigo-600 font-bold flex items-center justify-center gap-2">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></span>
                      Consultando arquivos digitais
                    </p>
                    <p className="text-slate-400 text-sm italic">Isso leva cerca de 10-15 segundos.</p>
                  </div>
                </div>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-200">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div>
                      <h3 className="text-3xl font-black text-slate-800">Mapa de Linhagem</h3>
                      <p className="text-slate-500">Desenho estrutural baseado nos registros encontrados</p>
                    </div>
                    <button 
                      onClick={() => window.print()} 
                      className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 transition shadow-lg"
                    >
                      <i className="fas fa-file-export"></i> Exportar Árvore
                    </button>
                  </div>
                  <FamilyTree data={result.tree} />
                </div>

                {result.sources.length > 0 && (
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl">
                    <h4 className="text-xs font-black text-slate-400 mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
                      <i className="fas fa-search-plus text-indigo-500"></i> Fontes de Pesquisa Encontradas
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {result.sources.map((source, idx) => (
                        <a 
                          key={idx}
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group p-4 rounded-2xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all flex items-center gap-4"
                        >
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                            <i className="fas fa-external-link-alt text-sm"></i>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-slate-800 font-bold text-sm truncate group-hover:text-indigo-700">{source.title}</p>
                            <p className="text-slate-400 text-[10px] truncate uppercase font-bold tracking-tighter">{new URL(source.uri).hostname}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-slate-100 pt-12 pb-12 text-center text-slate-400 text-sm px-6">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex justify-center gap-6 mb-4">
            <i className="fas fa-scroll opacity-20 text-2xl"></i>
            <i className="fas fa-shield-halved opacity-20 text-2xl"></i>
            <i className="fas fa-infinity opacity-20 text-2xl"></i>
          </div>
          <p className="font-bold text-slate-600 uppercase tracking-widest text-xs">Ancestry AI Research Project</p>
          <p className="leading-relaxed opacity-60">
            Esta ferramenta utiliza modelos de linguagem de larga escala para inferir conexões genealógicas. 
            Sempre verifique informações importantes em cartórios e arquivos oficiais.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
