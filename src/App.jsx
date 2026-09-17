import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
export default function App() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('Nenhum arquivo escolhido');
  const [formattedText, setFormattedText] = useState('');
  const [debugText, setDebugText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const [copyStatus, setCopyStatus] = useState('📋 Copiar para o WhatsApp');

  // Controle do Dark Mode persistente
  useEffect(() => {
    const savedTheme = localStorage.getItem('tema-os') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('tema-os', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  // Função auxiliar de Regex
  const extract = (regex, text) => {
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  };

  const processarTextoOS = (textoPdf) => {
    const cliente = extract(/Cliente:\s*\d+\s*-\s*(.*?)\s*CNPJ/i, textoPdf);
    const cidade = extract(/Cidade:\s*(.*?)\s*E-mail/i, textoPdf);
    const enderecoBase = extract(/Endereço:\s*(.*?)(?:\n|Compl)/i, textoPdf);
    const bloco = extract(/Bloco:\s*(\d+)/i, textoPdf);
    const apartamento = extract(/Apartamento:\s*(\d+)/i, textoPdf);
    const assunto = extract(/Assunto:\s*(.*?)\s*(?:Colaborador|Melhor horário)/i, textoPdf);
    
    const telefones = textoPdf.match(/\(\d{2}\)\s*\d{4,5}-\d{4}/g) || [];
    const contato = telefones.length > 0 ? telefones[0] : null;
    const recado = telefones.length > 1 ? telefones[1] : null;

    const login = extract(/Login PPPoE:\s*(\S+)/i, textoPdf);
    const senha = extract(/Senha PPPoE:\s*(\S+)/i, textoPdf);
    const condominio = extract(/Condominio:\s*(.*?)\s*Bloco/i, textoPdf);
    const plano = extract(/Velocidade:\s*(.*?)(?:\n|\s\s|\()/i, textoPdf);
    const obs = extract(/Descrição OS anterior:\s*(.*?)(?:\n|$)/i, textoPdf);
    const colaborador = extract(/Colaborador responsável:\s*(.*?)(?:\n|$)/i, textoPdf);
    const dataAgendada = extract(/Data agendada:\s*(\d{2}\/\d{2})/i, textoPdf);
    const horaAgendada = extract(/Data agendada:.*?\s(\d{2}:\d{2}:\d{2})/i, textoPdf);

    let enderecoCompleto = enderecoBase;
    if (enderecoBase) {
      if (bloco) enderecoCompleto += ` Bloco: ${bloco}`;
      if (apartamento) enderecoCompleto += ` AP: ${apartamento}`;
    }
    
    const loginCompleto = (login && senha) ? `${login} // ${senha}` : login;
    const agendamento = (colaborador && dataAgendada) ? `\nAgendado ao ${colaborador}, ${dataAgendada}, ${horaAgendada}` : null;

    const campos = [
      { rotulo: "👤 Cliente:", valor: cliente },
      { rotulo: "📍 Localização:", valor: cidade },
      { rotulo: "📌 Endereço:", valor: enderecoCompleto },
      { rotulo: "📝 Assunto:", valor: assunto },
      { rotulo: "📱 Contato:", valor: contato },
      { rotulo: "📞 Recado:", valor: recado },
      { rotulo: "📌 Login:", valor: loginCompleto },
      { rotulo: "🌍 Condomínio:", valor: condominio },
      { rotulo: "Plano:", valor: plano },
      { rotulo: "Obs.:", valor: obs },
      { rotulo: "", valor: agendamento }
    ];

    return campos
      .filter(c => c.valor)
      .map(c => `${c.rotulo} ${c.valor}`.trim())
      .join('\n');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const dadosDoPdf = new Uint8Array(arrayBuffer);
      const pdf = await pdfjsLib.getDocument({ data: dadosDoPdf }).promise;
      const pagina = await pdf.getPage(1);
      const conteudo = await pagina.getTextContent();
      
      let textoBruto = "";
      conteudo.items.forEach(item => {
        textoBruto += item.str;
        textoBruto += item.hasEOL ? '\n' : ' ';
      });

      const textoFinal = processarTextoOS(textoBruto);
      
      setFormattedText(textoFinal);
      setDebugText(textoBruto); // Fica oculto, mas salvo no estado
    } catch (error) {
      alert("Erro ao ler o PDF: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText);
    setCopyStatus('✅ Copiado com sucesso!');
    setTimeout(() => setCopyStatus('📋 Copiar para o WhatsApp'), 2000);
  };

  return (
    <section className="section" style={{ minHeight: '100vh', backgroundColor: 'var(--bulma-background)' }}>
      <div className="container is-max-desktop">
        
        {/* Header */}
        <div className="is-flex is-justify-content-space-between is-align-items-center mb-5">
          <h1 className="title is-3 has-text-danger mb-0">📄 Leitor de OS</h1>
          <button 
            className="button is-ghost is-rounded" 
            onClick={toggleTheme} 
            title="Alternar Tema"
          >
            <span className="is-size-4">{theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>
        </div>

        <div className="box">
          <p className="has-text-centered mb-5">
            Faça o upload do <b>arquivo PDF</b> para formatar instantaneamente.
          </p>
          
          {/* Formulário */}
          <form onSubmit={handleFormSubmit}>
            <div className="field">
              <div className="control">
                <div className="file is-centered is-boxed is-danger has-name is-fullwidth">
                  <label className="file-label">
                    <input 
                      className="file-input" 
                      type="file" 
                      accept="application/pdf" 
                      onChange={handleFileChange}
                      required 
                    />
                    <span className="file-cta">
                      <span className="file-label is-size-5">Escolher arquivo PDF...</span>
                    </span>
                    <span className="file-name has-text-centered">{fileName}</span>
                  </label>
                </div>
              </div>
            </div>
            
            <button 
              className={`button is-success is-large is-fullwidth mt-4 has-text-weight-bold ${isLoading ? 'is-loading' : ''}`} 
              type="submit"
            >
              Ler e Formatar PDF
            </button>
          </form>

          {/* Área de Resultado */}
          {formattedText && (
            <div className="mt-5">
              <hr />
              <h2 className="title is-4 mb-3">✅ Texto Formatado:</h2>
              
              <div className="field">
                <div className="control">
                  <textarea 
                    className="textarea is-info is-medium" 
                    rows="14" 
                    value={formattedText}
                    readOnly
                    style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}
                  />
                </div>
              </div>
              
              <button 
                className={`button is-large is-fullwidth has-text-weight-bold ${copyStatus.includes('✅') ? 'is-success' : 'is-info'}`}
                onClick={handleCopy}
              >
                {copyStatus}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}