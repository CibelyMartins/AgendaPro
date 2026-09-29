# AgendaPro API

API REST para o gerenciamento de categorias, serviços e agendamentos de uma empresa prestadora de serviços, como uma clínica, salão ou barbearia.

## Objetivo

O projeto permite cadastrar os serviços oferecidos, organizá-los por categoria e registrar os agendamentos de clientes. A aplicação foi desenvolvida para atender à APS da disciplina de Back-End.

## Integrante

- Godoy *(substituir pelo seu nome completo antes da entrega)*

## Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- Supabase
- PostgreSQL
- React *(interface administrativa)*
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
- `category_id`: UUID da categoria à qual pertence;
- `name`: nome do serviço;
- `description`: descrição opcional;
- `price`: preço do serviço;
- `duration_minutes`: duração estimada em minutos;
- `active`: indica se o serviço está disponível.

### Agendamento

- `id`: UUID;
- `service_id`: UUID do serviço agendado;
- `client_name`: nome do cliente;
- `client_phone`: telefone do cliente;
- `scheduled_at`: data e hora do agendamento;
- `status`: agendado, concluído ou cancelado;
- `notes`: observações opcionais.

Uma categoria pode possuir vários serviços. Um serviço pode possuir vários agendamentos. Cada serviço pertence a uma categoria e cada agendamento pertence a um serviço.

## Regras de negócio

- Um serviço só pode ser cadastrado em uma categoria existente.
- Um agendamento só pode ser cadastrado para um serviço existente e ativo.
- Não pode haver dois agendamentos ativos para o mesmo serviço no mesmo horário.
- Categorias com serviços e serviços com agendamentos não podem ser excluídos.

## Banco de dados

O script de criação das tabelas, relacionamentos, índices e regras está disponível em [`database/schema.sql`](database/schema.sql).

## Variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e informe as credenciais do seu projeto Supabase.

```env
PORT=3000
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

> O arquivo `.env` contém credenciais e não deve ser enviado ao GitHub.

## Próximas seções

As instruções de instalação, estrutura do projeto, documentação dos endpoints, exemplos de requisições e imagens da interface serão completadas durante o desenvolvimento.
