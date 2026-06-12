# API de Gerenciamento (Produtos, Clientes e Pedidos)

Esta é uma API desenvolvida em Node.js com TypeScript para o cadastro de produtos, clientes, realização de checkout de pedidos e consulta de notas fiscais de forma totalmente local.

## Como Executar o Projeto Localmente:

Siga os passos abaixo para clonar o repositório, instalar as dependências e inicializar o servidor em sua máquina.

### Pré-requisitos:
Antes de começar, certifique-se de ter instalado em sua máquina:

- Node.js (versão 16 ou superior recomendada)
- npm (gerenciador de pacotes do Node)

### Passo a Passo:

- Baixe ou clone o repositório para a sua máquina local:

```
git clone https://github.com/SwincikJr/fc-monolito.git
cd fc-monolito
```

- Instale as dependências do projeto executando o comando:
```
npm install
```
- Inicie o servidor em modo de desenvolvimento com o comando:
```
npm start
```
Após a execução, o servidor será inicializado localmente na porta 3000.

## Documentação da API (Swagger)

A API possui uma interface interativa do Swagger para que você possa visualizar e testar todos os endpoints disponíveis (como criar produtos, cadastrar clientes e submeter pedidos) sem a necessidade de ferramentas externas como o Postman ou Insomnia.

Uma vez que o servidor estiver rodando, você poderá consultar a documentação completa acessando o seguinte endereço no seu navegador:

http://localhost:3000/swagger
