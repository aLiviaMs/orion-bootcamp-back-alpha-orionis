# Orion Bootcamp Backend Boilerplate

Código base para o desenvolvimento do backend dos projetos do Orion Bootcamp.

### Requisitos de ambiente
- Node e NPM
- Docker e Docker Compose

### Configurações iniciais
- Alterar nome do projeto onde ele estiver como Orion (package.json, swaggerConfig, ...);

#### Banco de dados
- O projeto está pré configurado para utilizar MongoDB.

Para usar o MySQL:
- Trocar a environment de CONNECTION_STRING no arquivo docker-compose.yml;
- Alterar a dbConfig usada no app.ts;
- É recomendado remover todo o bloco do banco não utilizado dos services, no arquivo docker-compose.yml, para não ter um banco rodando desnecessariamente.

### Rodando o projeto
A princípio, rode o comando a seguir via terminal na raiz do projeto: `docker-compose up`.

Em caso de erro de permissão, especialmente após uma modificação no package.json, remova a pasta node_modules e rode:
```sh
npm install
docker-compose down -v 
docker-compose up --no-deps --build
```
OBS: Note que o docker-compose aqui utilizado é diferente da nova api do docker compose (sem hífen). Essa última não foi testada no presente projeto e está sujeita a falhas.

### Migration no Banco de Dados
Para criar um seed(propagador) no banco de dados execute o seguinte comando:
```sh
npx typeorm migration:create src/migrations/NAME.ts
```
Ao executar o comando, um novo arquivo .ts será gerado no diretório especificado com um esqueleto básico para a migração. Você deverá preencher este arquivo com os detalhes da migração. Cada migração possui dois métodos principais: up e down. O método up é usado para aplicar as alterações ao banco de dados, enquanto o método down é usado para desfazer as alterações.

#### Parâmetros
- src/migrations/: Este é o diretório onde a migração será criada. É padrão armazenar todas as migrações dentro de uma pasta migrations no diretório src.

- NAME.ts: Este é o nome do arquivo da migração. Substitua NAME pelo nome desejado para a sua migração. O nome deve ser descritivo, indicando a finalidade da migração (por exemplo, CreateUsersTable.ts).

### Instruções de testes
Para testar o funcionamento do projeto, após rodar ```docker-compose up```, é aconselhável abrir o Swagger UI acessando o seguinte endereço:
- http://localhost:8080/swagger/

Ao abrir a interface, envie uma requisição POST para /login clicando no botão _Try it out_ e em seguida _Execute_.
Usando as informações do usuário:
```json
{
  "email": "email@dele.aqui",
  "password": "SenhaDele@qui",
  "isRememberEnabled": true
}
```
Será gerado o token JWT, que virá na resposta no seguinte formato:
```json
{
  "status": true,
  "data": {
    "token": "ALEATORIO1.ALEATORIO2.ALEATORIO3"
  }
}
```
Guarde este token em um bloco de notas para uso posterior. Ele terá validade de 48 horas caso o parâmetro isRememberEnabled seja true, ou 2 horas caso seja false ou não exista.

Aqui já é possível testar com informações erradas, basta modificar o e-mail ou senha para checar as respectivas repostas de e-mail ou senha errados.

Com o token _em mãos_, é possível testar o dashboard. Para isso, na seção de Dashboard clique no cadeado e cole o token de autenticação JWT da mesma forma que veio na resposta, clique em Authorize e depois Close (nota: não é necessário adicionar _Bearer_. Isso é automaticamente anexado pelo Swagger UI).

Agora apenas siga a sequência padrão de Try it out e Execute. O Header Authorization será enviado junto à requisição.

A resposta virá da seguinte forma:
```json
{
  "status": true,
  "data": {
    "message": "Olá, email@dele.aqui!"
  }
}
```

Onde o e-mail apresentado foi extraído diretamente do token, que carrega por si só algumas informações do usuário.

Neste ponto também é possível testar tokens inválidos.
Para usar outro token, acesse o cadeado novamente e aperte Logout, liberando assim espaço para inserção de outro JWT.

#### Acessos:
- URL base: http://localhost:4444
- Documentação Swagger: http://localhost:4444/swagger
- Banco de dados MongoDB: mongodb://orion_root:j5m966qp7jiypfda@localhost:27017
- Banco de dados MySQL: mysql://orion_root:j5m966qp7jiypfda@localhost:3306
