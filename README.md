# IntelliFit

Plataforma web para gerenciamento de alimentos domésticos, permitindo organizar alimentos da despensa, geladeira e freezer, acompanhar datas de validade e receber sugestões de receitas.

## Tecnologias

### Frontend

* React
* TypeScript
* Vite
* React Router

### Backend

* Node.js
* TypeScript
* Express
* PostgreSQL
* JWT
* bcrypt
* Swagger / OpenAPI

## Estrutura do projeto

```text
IntelliFit/
├── backend/
│   ├── src/
│   ├── database.sql
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

* Node.js
* PostgreSQL
* Git

O pgAdmin pode ser utilizado para facilitar o gerenciamento do PostgreSQL.

## Configuração do banco de dados

Crie um banco de dados chamado:

```text
intellifit
```

Depois, execute o arquivo:

```text
backend/database.sql
```

Esse arquivo cria as tabelas necessárias para o funcionamento inicial da aplicação.

## Configuração do Backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie uma cópia do arquivo:

```text
.env.example
```

e renomeie a cópia para:

```text
.env
```

Configure os valores do arquivo `.env` de acordo com o PostgreSQL instalado na sua máquina.

Exemplo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_DO_POSTGRES
DB_NAME=intellifit
JWT_SECRET=CHAVE_SECRETA_DO_PROJETO
```

### Executar o Backend

Dentro da pasta `backend`:

```bash
npm run dev
```

O servidor será executado em:

```text
http://localhost:3000
```

A documentação da API estará disponível em:

```text
http://localhost:3000/api-docs
```

## Configuração do Frontend

Abra outro terminal e entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

### Executar o Frontend

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local para acessar a aplicação.

## Segurança

O arquivo `.env` contém informações sensíveis e **não deve ser enviado ao GitHub**.

O projeto utiliza o arquivo:

```text
.env.example
```

como modelo de configuração.

Também não é necessário enviar a pasta:

```text
node_modules/
```

As dependências podem ser instaladas novamente utilizando:

```bash
npm install
```

## Fluxo básico para novos integrantes

Depois de clonar o projeto:

```bash
git clone URL_DO_REPOSITORIO
cd IntelliFit
```

Instale as dependências:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Configure o PostgreSQL, execute `backend/database.sql`, crie o arquivo `backend/.env` e então execute o backend e o frontend.

## Status

Projeto acadêmico em desenvolvimento.
