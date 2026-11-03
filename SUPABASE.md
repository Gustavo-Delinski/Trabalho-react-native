# Configurar os dois bônus

## 1. Criar o projeto

Acesse https://supabase.com/dashboard com sua conta existente e crie um projeto separado chamado TeleLista. Não é necessário alterar o banco do trabalho anterior. Guarde a senha do banco; ela não entra no aplicativo.

## 2. Criar a tabela e proteger os dados

No projeto TeleLista, abra **SQL Editor**, crie uma consulta, cole todo o conteúdo de `supabase/schema.sql` e execute **Run**. O arquivo cria `user_items`, ativa Row Level Security e permite que cada usuário acesse somente seus próprios registros.

## 3. Conectar o app

No diálogo **Connect** do projeto, copie a **Project URL**. Em **Settings > API Keys**, copie a chave **Publishable**. Se o painel mostrar nomes diferentes, procure pelos campos Project URL e Publishable key.

Copie `.env.example` para `.env`, na mesma pasta de `package.json`, e preencha:

```env
EXPO_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=SUA-CHAVE-PUBLICA
```

Nunca use a senha do banco, uma chave secret ou service_role. Pare o Expo com Ctrl+C e reinicie com `npx expo start --clear` após preencher as variáveis.

## 4. Cadastro e confirmação

Em **Authentication > Providers/Sign In > Email**, mantenha o login por e-mail habilitado. Se a confirmação de e-mail estiver ativa, cadastre um endereço real, confirme pelo e-mail e depois entre no app. A tela de cadastro avisa quando a confirmação é necessária. A confirmação pode ser desativada no projeto de demonstração se o grupo preferir cadastro e entrada imediatos; as contas continuam sendo autenticadas pelo Supabase.

As contas da versão local não são contas do Supabase. Faça um novo cadastro; a versão anterior está preservada no backup. Não há migração automática de favoritos da conta local antiga.

## 5. Testar os bônus antes de declarar implementado

1. Cadastre a conta A, entre e favorite uma série. Marque outra como assistida e dê nota 5.
2. Aguarde a barra mostrar Dados sincronizados. Em **Table Editor > user_items**, confira as linhas e o `user_id`. Em **Authentication > Users**, confira a conta.
3. Feche e reabra o app: a sessão e os dados devem continuar.
4. Em outro aparelho/instalação com o mesmo projeto, entre na conta A. Favoritos, assistidas e notas devem aparecer. Use Atualizar para buscar mudanças feitas em outro aparelho.
5. Crie a conta B. Ela não deve enxergar os dados da conta A.
6. Na conta A, depois de uma sincronização bem-sucedida, desligue a internet, altere uma nota e remova um favorito. Ligue a internet e toque Tentar novamente/Atualizar. Confira que a nota e a remoção chegaram ao banco e ao outro aparelho.
7. Confira login incorreto, logout e mensagem de confirmação de e-mail, se habilitada.

A cópia local permite usar dados já carregados offline; cadastro, primeiro login e recuperação de dados em outro aparelho precisam de internet. Não há atualização em tempo real por websocket. O app sincroniza ao iniciar, retomar, tocar Atualizar e a cada 30 segundos em primeiro plano. Conflitos na mesma série usam a última gravação recebida pelo servidor; alterações em séries diferentes são independentes.

## 6. Atualizar a entrega

No PDF: persistência **Local + Supabase/Postgres**, login **Supabase Auth**, RF06/RF07 com os caminhos do README. No vídeo, mostre a tabela com os registros, uma conta real e os mesmos dados em outro aparelho. Só declare os bônus concluídos depois de testar a conexão real.
