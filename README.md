
# api-idqbrn

Back-end do sistema de controle de doenças do IDQBRN 

## 🔨 Funcionalidades do projeto

O projeto compoe toda a estrutura que permite a operacao do sistema de controle de doencas do IDQBRN.
Aqui fazemos o controle do banco de dados (CRUD), criamos as rotas e filtros para realizar a comunicação e troca de dados com o front.


## ✔️ Técnicas e tecnologias utilizadas



- `NodeJS`: Programa de desenvolvimento para aplicações em Javascript fora da web
- `Express`: Framework para Node.js para construcao de servidores web
- `Sequelize`: ORM baseado para Node.js para mapear os dados relacionais em objetos Javascript 
- `MySQL`: O banco de dados utilizado foi o MySQL 

## 📁 Acesso ao projeto

Para ter acesso aos arquivos do projeto você pode clonar usando o seguinte comando:

```
git clone https://github.com/ccsg12/api-idqbrn.git
```

## 🛠️ Abrir e rodar o projeto

Agora que já tem a pasta do projeto na sua máquina, dentro dela instale as dependências:
```
npm install
```

Para que o projeto seja executado corretamente, é preciso adicionar as variáveis de ambiente do NodeJs.

- Windows
```
SET idqbrn_db_host="localhost" ## Apenas para desenvolvimento
SET idqbrn_db_username="seu usuário de acesso ao banco mysql"
SET idqbrn_db_password="sua senha de acesso"
SET idqbrn_jwt_private_key="qualquer string para servir de codificadora/decodificadora do hash"
```

- Windows - Powershell
```
$env:idqbrn_db_host="localhost" ## Apenas para desenvolvimento
$env:idqbrn_db_username="seu usuário de acesso ao banco mysql"
$env:idqbrn_db_password="sua senha de acesso"
$env:idqbrn_jwt_private_key="qualquer string para servir de codificadora/decodificadora do hash"
```

- Mac
```
EXPORT idqbrn_db_host="localhost" ## Apenas para desenvolvimento
EXPORT idqbrn_db_username="seu usuário de acesso ao banco mysql"
EXPORT idqbrn_db_password="sua senha de acesso"
EXPORT idqbrn_jwt_private_key="qualquer string para servir de codificadora/decodificadora do hash"
```

Então podemos rodar o projeto
```
npm start
```
A aplicação deve iniciar na porta 3000 com endereço [http://localhost:3000](http://localhost:3000) por padrão para o ambiente de desenvolvimento.
