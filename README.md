# 🚀 Projeto de Gerenciamento de Tarefas (Task Manager)

Este projeto é uma aplicação backend simples de gerenciamento de tarefas, desenvolvida primariamente para **treinamento e consolidação dos conceitos de Clean Architecture (Arquitetura Limpa)** e padrões de design como a Inversão de Controle (IoC) e Separação de Responsabilidades (SRP), utilizando TypeScript e Express.

## 🎯 Objetivos Principais

O foco principal deste projeto é demonstrar a aplicação prática de:

* **Regra de Dependência:** As dependências sempre fluem das camadas externas (Infraestrutura, Apresentação) para as camadas internas (Domínio, Aplicação), garantindo que as regras de negócio permaneçam isoladas de detalhes técnicos.
* **Separação de Preocupações:** O código é estritamente dividido em camadas, onde cada uma tem responsabilidades bem definidas.
* **Portas e Adaptadores (Ports & Adapters):** O Domínio define interfaces (Portas, como `ITaskRepository`), e a Infraestrutura fornece as implementações concretas (Adaptadores, como `TaskMemoryRepository`).

## 🧱 Estrutura da Arquitetura Limpa

A aplicação segue a estrutura de quatro camadas: 

1.  **DOMAIN (Domínio):** O centro do sistema. Contém as entidades (`Task`, `Category`) e as interfaces (Portas) que definem o que o sistema *faz*, como `ITaskRepository`. É totalmente independente de frameworks e bancos de dados.
2.  **APPLICATION (Aplicação/Use Cases):** Contém os casos de uso (`TaskService`) que orquestram a Entidade para realizar uma tarefa específica (ex: `createTask`, `updateTask`). É onde residem as regras de negócio específicas da aplicação (ex: "Não permitir títulos duplicados", "Não deletar tarefas concluídas").
3.  **INFRASTRUCTURE (Infraestrutura):** Contém os detalhes técnicos (Adaptadores), como a implementação do repositório em memória (`TaskMemoryRepository`), o `server.ts` e a geração de UUIDs. Implementa as interfaces definidas no Domínio.
4.  **PRESENTATION (Apresentação/Web):** Contém os adaptadores de entrada, como o `TaskController` e as rotas Express, responsáveis por receber requisições HTTP e formatar a resposta.

## 🛠️ Tecnologias Utilizadas

* **Linguagem:** TypeScript
* **Runtime:** Node.js
* **Framework Web:** Express
* **Persistência:** Repositórios em Memória (simulação de um banco de dados).

## 📌 Rotas de Exemplo (Endpoints)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/tasks` | Cria uma nova tarefa. |
| `GET` | `/tasks` | Lista todas as tarefas. |
| `GET` | `/tasks/id/:id` | Busca uma tarefa por ID. |
| `GET` | `/tasks/title/:title` | Busca uma tarefa por título. |
| `PUT` | `/tasks/:id` | Atualiza parcialmente uma tarefa. |
| `DELETE` | `/tasks/:id` | Remove uma tarefa (com regra de negócio de status). |

## ⚙️ Como Executar

1.  Clone o repositório.
2.  Instale as dependências: `npm install` (ou `yarn install`).
3.  Execute a aplicação: `npm run dev` (ou comando configurado no `package.json`).
4.  Acesse: `http://localhost:3000/tasks`