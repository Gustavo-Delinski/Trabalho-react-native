# TeleLista — React Native + Expo

Catálogo de séries da TVMaze com login real (Supabase Auth), favoritos e séries assistidas com nota de 1 a 5.

## Como rodar

1. Instale Node.js LTS e o Expo Go no celular.
2. Na pasta do projeto, execute `npm install`.
3. Configure o Supabase conforme `SUPABASE.md`: execute `supabase/schema.sql` no painel e preencha `.env` usando `.env.example`.
4. Execute `npx expo start` e abra o QR Code no Expo Go.

## Dados e autenticação

- Sessão persistente com Supabase Auth. O aplicativo não guarda senhas.
- Favoritos e assistidas são salvos na tabela `user_items`, associados ao ID autenticado.
- Políticas RLS limitam leitura, gravação e remoção aos itens da própria conta.
- AsyncStorage mantém uma cópia local e uma fila de alterações pendentes por conta.
- Alterações offline são reenviadas ao abrir/retomar o app, pelo botão Atualizar e a cada 30 segundos com o app ativo.
- Sincronização por item: alterações em séries diferentes não substituem a coleção inteira. Para a mesma série, prevalece a última gravação enviada ao servidor.
- Não há migração automática das antigas contas locais. Crie uma conta real para testar a versão em nuvem.
- As variáveis `EXPO_PUBLIC_` são públicas no app. Use somente a chave **publishable**, nunca secret/service_role. O `.env` não deve ir ao GitHub.

## Mapa dos requisitos

| RF | Arquivos principais |
|---|---|
| RF01 Catálogo/paginação | `src/screens/HomeScreen.js`, `src/components/CatalogList.js`, `src/hooks/usePaginatedList.js` |
| RF02 Navegação | `src/navigation/AppNavigator.js`, `src/navigation/RootNavigator.js` |
| RF03 Detalhes | `src/screens/DetailsScreen.js`, `src/services/api.js` |
| RF04/RF05 Favoritos | `src/contexts/FavoritesContext.js`, `src/screens/FavoritesScreen.js` |
| RF06 Local + nuvem | `src/hooks/useCloudCollection.js`, `src/services/cloudService.js`, `supabase/schema.sql` |
| RF07 Auth real/sessão/assistidas | `src/services/authService.js`, `src/contexts/AuthContext.js`, `src/contexts/ConsumedContext.js` |
| RF08 Busca | `src/screens/SearchScreen.js` |
| RF09 Feedback | `src/components/ErrorView.js`, `src/components/CloudStatus.js`, `src/hooks/useFetch.js` |
| RF10 Acessibilidade | `src/components/`, telas e navegação |

## Integrantes

- Zhou Ka Shen
- Gustavo Delinski Tavares

## Executar no navegador

Execute `npx expo start --web`. A versão Android pode ser aberta pelo Expo Go com `npx expo start`.
