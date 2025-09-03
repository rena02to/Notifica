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
