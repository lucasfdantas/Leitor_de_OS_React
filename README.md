# Leitor de OS

Aplicação web para ler arquivos PDF de ordens de serviço (OS), extrair informações relevantes e formatar o texto para facilitar a cópia e envio por WhatsApp.

## Sobre o projeto

Este projeto foi desenvolvido como uma ferramenta prática para automatizar a leitura de dados de documentos PDF e transformar o conteúdo em um formato mais organizado, legível e rápido de usar.

Ele pode ser usado como projeto pessoal, ferramenta de produtividade e também como exemplo de portfólio em tecnologia frontend.

## Funcionalidades

- Upload de arquivo PDF
- Leitura do conteúdo do documento com PDF.js
- Extração automática de dados como:
  - cliente
  - endereço
  - contato
  - login e senha
  - condomínio
  - assunto
  - agendamento
- Formatação do texto para cópia rápida
- Botão de cópia para WhatsApp
- Tema claro e escuro
- Interface responsiva com Bulma

## Tecnologias utilizadas

- React
- Vite
- JavaScript
- Bulma
- PDF.js

## Estrutura do projeto

```bash
leitor-os/
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── .gitignore
└── package-lock.json
```

## Requisitos

- Node.js 18 ou superior
- npm

## Como executar localmente

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o projeto em modo de desenvolvimento:

```bash
npm run dev
```

4. Abra o navegador na URL exibida no terminal, normalmente:

```bash
http://localhost:5173
```

## Build para produção

Para gerar a versão de produção:

```bash
npm run build
```

A pasta gerada será a `dist/`.

## Publicação no GitHub Pages

Para publicar esse projeto como portfólio no GitHub Pages:

1. Certifique-se de que o projeto está em um repositório no GitHub.
2. Gere o build de produção com:

```bash
npm run build
```

3. No GitHub, acesse o repositório e vá em:
   - Settings
   - Pages
   - Escolha a branch ou a pasta de deploy
4. Se for um projeto Vite com caminhos relativos, verifique o arquivo `vite.config.js` e ajuste a opção `base` conforme o nome do repositório, por exemplo:

```js
export default defineConfig({
  base: '/seu-repositorio/',
  plugins: [react()],
})
```

> Isso é importante para que a aplicação funcione corretamente no GitHub Pages.

## Licença

Este projeto está disponível para fins educacionais e de portfólio pessoal.

## Autor

Lucas Dantas

## Observação

Este projeto foi pensado para ser simples, funcional e visualmente limpo, com foco em demonstrar habilidades em frontend, extração de dados de PDF e UX voltada para produtividade.
