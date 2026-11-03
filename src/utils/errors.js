// Converte erros do Axios em mensagens amigáveis (RF09).
export function getErrorMessage(error) {
  if (error?.response) {
    return `A API respondeu com um erro (código ${error.response.status}). Tente novamente em instantes.`;
  }
  if (error?.code === 'ECONNABORTED') {
    return 'A requisição demorou demais. Verifique sua conexão e tente novamente.';
  }
  if (error?.request || error?.message === 'Network Error') {
    return 'Não foi possível conectar. Verifique sua internet e tente novamente.';
  }
  return error?.message || 'Algo deu errado. Tente novamente.';
}
