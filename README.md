# Jornal Escolar Ana Neri — Site

Site do jornal escolar com painel administrativo em `/admin` (código de acesso: **1554**).

## Rodando em desenvolvimento

```bash
pnpm install
pnpm dev
```

Abra http://localhost:3000.

## Publicando no banco de dados (MongoDB Atlas)

O site usa **MongoDB Atlas**. Enquanto não houver `MONGODB_URI`, os cards
são salvos em `data/cards.json` (modo de desenvolvimento). Ao configurar o banco, tudo passa
a ser gravado e lido de lá automaticamente — nenhuma alteração de código é necessária.

### 1. Criar o cluster no Atlas

1. Crie uma conta gratuita em [cloud.mongodb.com](https://cloud.mongodb.com) e crie um cluster (M0 grátis);
2. **Network Access** → *Add IP Address* → permita o IP da sua máquina (na Vercel, use `0.0.0.0/0`);
3. **Database Access** → crie o usuário e a senha que serão usados na conexão.

### 2. Pegar a string de conexão

No Atlas: **Connect → Drivers** e copie a string no formato:

```
mongodb+srv://<USUARIO>:<SENHA>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

Substitua `<USUARIO>` e `<SENHA>` pelos dados criados no passo 1.

### 3. Configurar as variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

| Variável                | Uso                                                                 |
| ----------------------- | ------------------------------------------------------------------- |
| `MONGODB_URI`           | Connection string do Atlas (passo 2). Ativa o modo banco em `/api/cards`. |
| `BLOB_READ_WRITE_TOKEN` | Uploads na nuvem (Vercel Blob). Obrigatório em produção serverless. |

> Sem `BLOB_READ_WRITE_TOKEN`, os uploads vão para `public/uploads`, que funciona apenas
> localmente (sistemas serverless são efêmeros). Para produzir o token: **Vercel → Storage →
> Create Database → Blob**, e o token é adicionado ao projeto automaticamente.

Depois crie os índices da coleção `cards`:

```bash
pnpm db:push
```

Os cards padrão são criados automaticamente no primeiro acesso ao site (ou em `/admin`).

> Sem `BLOB_READ_WRITE_TOKEN`, os uploads vão para `public/uploads`, que funciona apenas
> localmente (sistemas serverless são efêmeros). Para produzir o token: **Vercel → Storage →
> Create Database → Blob**, e o token é adicionado ao projeto automaticamente.

### Deploy

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
