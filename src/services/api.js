import axios from 'axios';
import { stripHtml } from '../utils/html';

// URL em variável de ambiente (EXPO_PUBLIC_*), com fallback para a API pública TVMaze.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.tvmaze.com';

const api = axios.create({ baseURL: BASE_URL, timeout: 15000 });

export function translateStatus(status) {
  return (
    {
      Running: 'Em exibição',
      Ended: 'Finalizada',
      'To Be Determined': 'A definir',
      'In Development': 'Em desenvolvimento',
    }[status] ||
    status ||
    'Desconhecido'
  );
}

// Resumo usado em listas/cards e salvo em favoritos/consumidos.
function toSummary(show) {
  return {
    id: show.id,
    name: show.name,
    image: show.image?.medium || show.image?.original || null, // pode ser null: o card usa placeholder
    status: show.status,
    genre: show.genres?.[0] || show.type || 'Série',
  };
}

// Lista paginada. O hook usa páginas a partir de 1; a TVMaze começa em 0.
// Quando a página não existe, a API responde 404: significa "fim da lista".
export async function getShows(page = 1, signal) {
  try {
    const { data } = await api.get('/shows', { params: { page: page - 1 }, signal });
    return { results: data.map(toSummary), hasNext: data.length > 0 };
  } catch (error) {
    if (error?.response?.status === 404) return { results: [], hasNext: false };
    throw error;
  }
}

// Busca por nome (a rota de busca da TVMaze não é paginada).
export async function searchShows(query, page = 1, signal) {
  if (page > 1) return { results: [], hasNext: false };
  const { data } = await api.get('/search/shows', { params: { q: query }, signal });
  return { results: data.map((entry) => toSummary(entry.show)), hasNext: false };
}

// Detalhe completo pelo id (segunda requisição, RF03). A sinopse vem em HTML e é limpa aqui.
export async function getShow(id, signal) {
  const { data } = await api.get(`/shows/${id}`, { signal });
  return {
    ...toSummary(data),
    image: data.image?.original || data.image?.medium || null,
    description: stripHtml(data.summary) || 'Sinopse não disponível.',
    type: data.type,
    language: data.language,
    genres: data.genres || [],
    premiered: data.premiered,
    ended: data.ended,
    rating: data.rating?.average ?? null,
    network: data.network?.name || data.webChannel?.name || null,
    runtime: data.runtime || data.averageRuntime || null,
  };
}
