# Jornal Escolar Ana Neri — Site

Site do jornal escolar com painel administrativo em `/admin` (código de acesso: **1554**).

## Rodando em desenvolvimento

```bash
pnpm install
pnpm dev
```

Abra http://localhost:3000.

## Publicando no banco de dados (Supabase)

O site usa **PostgreSQL** com **Drizzle ORM**. Enquanto não houver `DATABASE_URL`, os cards
são salvos em `data/cards.json` (modo de desenvolvimento). Ao configurar o banco, tudo passa
a ser gravado e lido de lá automaticamente — nenhuma alteração de código é necessária.

### 1. Criar o projeto no Supabase

1. Crie uma conta gratuita em [supabase.com](https://supabase.com) e crie um projeto;
2. Aguarde o provisionamento terminar;
3. Aplique o schema da tabela `project_cards` — duas opções:
   - **Pelo dashboard:** copie o conteúdo de `data/schema.sql` e cole no
     **SQL Editor** do Supabase, clicando em **Run**; *ou*
   - **Pelo terminal:** `pnpm db:push` (após configurar `DATABASE_URL` no passo 2).

### 2. Pegar a string de conexão

No Supabase: **Project Settings → Database → Connection string → URI**.

Use a conexão **Pooler** (porta `6543`) para deploys serverless (Vercel):

```
postgresql://postgres.<REF-DO-PROJETO>:<SUA-SENHA>@aws-0-<regiao>.pooler.supabase.com:6543/postgres?sslmode=require
```

> Neon/Railway também funcionam: é uma string PostgreSQL padrão com `?sslmode=require`.

### 3. Configurar as variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

| Variável                | Uso                                                                 |
| ----------------------- | ------------------------------------------------------------------- |
| `DATABASE_URL`          | String de conexão do Supabase (passo 2). Ativa o modo banco em `/api/cards`. |
| `BLOB_READ_WRITE_TOKEN` | Uploads na nuvem (Vercel Blob). Obrigatório em produção serverless. |

> Sem `BLOB_READ_WRITE_TOKEN`, os uploads vão para `public/uploads`, que funciona apenas
> localmente (sistemas serverless são efêmeros). Para produzir o token: **Vercel → Storage →
> Create Database → Blob**, e o token é adicionado ao projeto automaticamente.

### 4. Fazer o deploy

```bash
pnpm build
```

Opções:
- **Vercel (recomendado):** conecte o repositório em vercel.com e adicione as duas variáveis de ambiente acima nas configurações do projeto.
- Outro host: rode `pnpm build && pnpm start` com as variáveis configuradas.

## Funcionamento dos cards

- **Página inicial:** no máximo 2 cards marcados como "Página Inicial" no painel.
- **Projetos:** todos os cards não marcados como página inicial, exibidos em `/projetos`.
- Cada card salva um **tipo de mídia** (`image` ou `video`):
  - **Imagem** → a imagem aparece no card e é ampliada ao clicar;
  - **Vídeo** → o card mostra o player com botão de play (upload ou URL externa).
- Uploads aceitos: imagem até 8 MB, vídeo até 100 MB.
