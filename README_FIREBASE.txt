GPF V3.0 - CONFIGURAR LOGIN, NUVEM E SINCRONIZAÇÃO

Esta versão já está preparada para Firebase, mas só funciona em nuvem depois de você criar seu projeto Firebase.

PASSO 1 - Criar projeto
1. Acesse Firebase Console.
2. Crie um projeto.
3. Adicione um App Web.
4. Copie o objeto firebaseConfig.
5. Cole os valores no arquivo firebase-config.js.

PASSO 2 - Ativar login
1. Vá em Authentication.
2. Clique em Sign-in method.
3. Ative Email/Password.

PASSO 3 - Ativar banco
1. Vá em Firestore Database.
2. Crie o banco.
3. Publique as regras do arquivo firestore.rules.

PASSO 4 - Primeiro acesso
1. Abra o app.
2. Na tela de login, use Primeiro acesso.
3. Informe nome da empresa, e-mail e senha do administrador.
4. Depois disso, entre pelo login normal.

PERMISSÕES
- Administrador: acesso completo.
- Líder: lança produção e vê relatórios.
- Visualizador: consulta dados e relatórios.

OBSERVAÇÃO
Sem o firebase-config.js preenchido, o app continua funcionando em modo local com admin/admin, mas sem sincronização entre celulares.
