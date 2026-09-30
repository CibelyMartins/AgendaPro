# AgendaPro API

API REST para gerenciar categorias, serviços e agendamentos de uma empresa prestadora de serviços, como uma clínica, salão ou barbearia.

## Objetivo

Permitir o cadastro e a organização de serviços por categoria, além do registro de agendamentos de clientes.

## Integrante

- [Substitua pelo seu nome completo]

## Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- Supabase
- PostgreSQL
- Git e GitHub

## Entidades e relacionamento

```text
Categoria (1) ──< Serviço (1) ──< Agendamento
```

### Categoria

- `id`: UUID;
- `name`: nome da categoria;
- `description`: descrição opcional;
- `active`: indica se a categoria está ativa.

### Serviço

- `id`: UUID;
- `category_id`: UUID da categoria;
- `name`: nome do serviço;
- `description`: descrição opcional;
- `price`: preço do serviço;
- `duration_minutes`: duração estimada em minutos;
- `active`: indica se o serviço está disponível.

### Agendamento

- `id`: UUID;
- `service_id`: UUID do serviço;
- `client_name`: nome do cliente;
- `client_phone`: telefone do cliente;
- `scheduled_at`: data e hora;
- `status`: agendado, concluído ou cancelado;
- `notes`: observações opcionais.

## Estrutura do projeto

```text
src/
├── config/       # conexão com o Supabase
├── controllers/  # requisições, validações e respostas HTTP
├── models/       # operações no banco de dados
├── routes/       # definição das rotas
├── app.ts        # configuração do Express
└── server.ts     # inicialização do servidor
```

## Configuração e execução

```bash
git clone <url-do-repositorio>
cd AgendaPro
npm install
```

Copie `.env.example` para `.env` e preencha as credenciais do seu projeto Supabase. Depois, execute:

```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`.

## Variáveis de ambiente

```env
PORT=3000
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SECRET_KEY=sb_secret_sua_chave_aqui
```

> Nunca envie o arquivo `.env` ou a chave secreta ao repositório.

## Banco de dados

O script para criar as tabelas e os relacionamentos está em [database/schema.sql](database/schema.sql). Execute-o no SQL Editor do Supabase.

## Endpoints

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/categories` | Lista categorias |
| GET | `/categories/:id` | Busca categoria por UUID |
| POST | `/categories` | Cria categoria |
| PUT | `/categories/:id` | Atualiza categoria |
| DELETE | `/categories/:id` | Exclui categoria |
| GET | `/services` | Lista serviços |
| GET | `/services/:id` | Busca serviço por UUID |
| POST | `/services` | Cria serviço |
| PUT | `/services/:id` | Atualiza serviço |
| DELETE | `/services/:id` | Exclui serviço |
| GET | `/appointments` | Lista agendamentos |
| GET | `/appointments/:id` | Busca agendamento por UUID |
| POST | `/appointments` | Cria agendamento |
| PUT | `/appointments/:id` | Atualiza agendamento |
| DELETE | `/appointments/:id` | Exclui agendamento |

## Exemplos de requisições

### Criar categoria

```json
{
  "name": "Cortes de cabelo",
  "description": "Cortes masculinos e femininos",
  "active": true
}
```

### Criar serviço

```json
{
  "category_id": "UUID_DA_CATEGORIA",
  "name": "Corte feminino",
  "description": "Corte e finalização",
  "price": 80,
  "duration_minutes": 60,
  "active": true
}
```

### Criar agendamento

```json
{
  "service_id": "UUID_DO_SERVICO",
  "client_name": "Maria Silva",
  "client_phone": "11999999999",
  "scheduled_at": "2026-10-05T14:00:00-03:00",
  "status": "agendado",
  "notes": "Cliente prefere atendimento à tarde"
}
```
