# Gerenciador de Produção - Frontend Web React + Vite

Frontend web desenvolvido em React para gerenciamento de produção industrial.

## Funcionalidades
- Visualização e gerenciamento de produtos;
- Visualização e gerenciamento de matérias primas;
- Associação entre produtos e matérias primas;
- Interface responsiva e intuitiva;

## Stack
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- React Query
- Axios

## Como executar o projeto (localmente)

### Pré-requisitos
- Node.js 22+
- pnpm (opcional, mas recomendado)

### Instalação

Instale as dependências:
```bash
pnpm install
# ou
npm install
```

### Executando

Inicie o servidor de desenvolvimento:
```bash
pnpm dev
# ou
npm run dev
```

A aplicação será iniciada em:
```bash
 http://localhost:5173
```

### Build para produção

```bash
pnpm build
# ou
npm run build
```

### Variáveis de ambiente (opcional)

Por padrão, a API está configurada para `http://localhost:8080` em **src/service/api.ts**. 

## Executando com Docker

### Build da imagem

Na raiz do projeto, execute:
```bash
docker build -t industry-client:1.0 .
```

### Executando o container

Rode o container expondo na porta 80:
```bash
docker run -d --name industry-client -p 80:80 industry-client:1.0
```

A aplicação será iniciada em:
```bash
 http://localhost:80
```

## Melhorias Futuras
- Autenticação e autorização via JWT;
- Dark mode;
- Dashboard com métricas de produção;
- Relatórios e exportação de dados;