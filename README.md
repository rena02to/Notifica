# Objetivo do projeto

Implementar um sistema simples de Notificação Judicial com base no fluxo fornecido:

1. Criar uma notificação judicial (status inicial Em Andamento).

Nesta etapa deve-se criar uma notificação judicial no banco de dados com o status inicial de Em Andamento

Campos para resposta: Título, Descrição e Data da audiência.

2. Preencher informações do(a) notificado(a).

Nesta etapa deve-se permitir a complementação das informações da pessoa que será notificada. Ao finalizar, alterar o status para Validação

Campos para visualização: Campos incluídos na etapa de “Criar uma notificação judicial” (deve permitir edição)

Campos para resposta: Nome, email, telefone e endereço completo.

3. Validar informações da notificação judicial.

Campos para visualização: Campos incluídos na etapa de “Criar uma notificação judicial” e “Preencher informações do(a) notificado(a)” (não deve permitir edição).

Campos para resposta: “Necessita de informações adicionais?”

- Caso a resposta seja “Sim” → voltar para a etapa “ Preencher informações do(a) notificado(a)” (Alterar status para “Em Andamento”).
- Caso a resposta seja “Não”→ seguir para conclusão (Alterar status para Concluído).

## Stack utilizada

**Front-end:** React, Formik, MIU, React Icons

**Back-end:** FastAPI, PostgreSQL

![FastAPI](https://skillicons.dev/icons?i=fastapi "FastAPI")
![PostgreSQL](https://skillicons.dev/icons?i=postgres "PostgreSQ")
![React](https://skillicons.dev/icons?i=react "React")
![Next](https://skillicons.dev/icons?i=next "Next")


# Rodando Localmente

## Pré-requisitos

Antes de começar, certifique-se de ter instalado na sua máquina:

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## Passo 1: Clonar o projeto

Abra o terminal e execute:

```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DA_PASTA_DO_PROJETO>
```

## Passo 2: Editando as variáveis de ambiente

Preencha as váriáveis POSTGRESUSER, POSTGRES_PASSWORD, POSTGRES_DB (de .env) e DB_NAME, DB_USER, DB_PASSWORD, SECRET_KEY, DATABASE_URL (de /backend/.env) criando dados para preenchê-las. Ex:
```bash
POSTGRES_USER=meu_usuario
POSTGRES_PASSWORD='SenhaSuperSegura1234$'
POSTGRES_DB=meu_banco
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_INITDB_ARGS="--encoding=UTF8 --locale=pt_BR.UTF-8"
DATABASE_URL=postgresql+psycopg2://meu_usuario:'SenhaSuperSegura1234$'@db:5432/meu_banco
```
Crie de forma que a senha não contenha aspas simples nem duplas, bem como o SECRET_KEY (que deve ter acima de 16 caracteres)

## Passo 3: Buildar o container do Docker com as imagens do front e back

No terminal do projeto, rode:

```bash
docker compose up --build -d
```
Isso:
1. Baixar as imagens necessárias do Docker Hub.
2. Construir o backend e frontend.
3. Inicializar o banco de dados PostgreSQL.
4. Rodar o servidor FastAPI (backend) e React (frontend)

## Passo 4: Acessar a aplicação
Após o comando acima finalizar, a aplicação estará disponível nos seguintes endereços:
- Frontend React: http://localhost:3000
- API Backend: http://localhost:8000/api/
