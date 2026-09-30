# AgendaPro API

API REST para o gerenciamento de categorias e serviços de uma empresa prestadora de serviços, como uma clínica, salão ou barbearia.

## Objetivo

O projeto permite cadastrar os serviços oferecidos e organizá-los por categoria. A aplicação foi desenvolvida para atender à APS da disciplina de Back-End.

## Integrante

- Godoy *(substituir pelo seu nome completo antes da entrega)*

## Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- Supabase
- PostgreSQL
- React *(interface administrativa simples)*
- Git e GitHub

## Entidades e relacionamento

```text
Categoria (1) ──< Serviço
```

### Categoria

- `id`: UUID;
- `name`: nome da categoria;
- `description`: descrição opcional;
- `active`: indica se a categoria está ativa.

### Serviço

- `id`: UUID;
- `category_id`: UUID da categoria à qual pertence;
- `name`: nome do serviço;
- `description`: descrição opcional;
- `price`: preço do serviço;
- `duration_minutes`: duração estimada em minutos;
- `active`: indica se o serviço está disponível.

Uma categoria pode possuir vários serviços e cada serviço pertence a uma única categoria.

## Regras de negócio

- Um serviço só pode ser cadastrado em uma categoria existente.
- Categorias que possuem serviços vinculados não podem ser excluídas.

## Banco de dados

O script de criação das tabelas, relacionamentos, índices e regras está disponível em [`database/schema.sql`](database/schema.sql).

## Configuração e execução do backend

Entre na pasta `backend`, instale as dependências e inicie a API em modo de desenvolvimento:

```bash
cd backend
npm install
npm run dev
```

Com a API iniciada, consulte a rota de verificação em `http://localhost:3000/api/health`.

## Variáveis de ambiente

Copie o arquivo `backend/.env.example` para `backend/.env` e informe as credenciais do seu projeto Supabase.

```env
PORT=3000
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SECRET_KEY=sua_chave_secret_aqui
```

> O arquivo `.env` contém credenciais e não deve ser enviado ao GitHub. A chave `secret` só será utilizada pelo backend e jamais poderá ser colocada no frontend.

## Próximas seções

As instruções de instalação, estrutura do projeto, documentação dos endpoints, exemplos de requisições e imagens da interface serão completadas durante o desenvolvimento.
