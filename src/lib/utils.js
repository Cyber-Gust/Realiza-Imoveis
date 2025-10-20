/**
 * Centraliza o tratamento de erros da aplicação.
 * @param {Error} error - O objeto de erro capturado.
 * @param {string} context - O contexto onde o erro ocorreu (ex: 'fetchProperties').
 * @returns {object} Um objeto de erro padronizado para respostas de API.
 */
export function handleError(error, context = 'Operação no servidor') {
  console.error(`[${context}] Supabase Error:`, error.message);

  // Retorna uma estrutura de erro consistente para a API
  return {
    error: `Ocorreu um erro em: ${context}. Mensagem: ${error.message}`,
    details: error,
  };
}

/**
 * Formata uma resposta de sucesso para a API.
 * @param {any} data - Os dados a serem retornados.
 * @param {number} status - O código de status HTTP (padrão 200).
 * @returns {object} Um objeto de resposta padronizado.
 */
export function handleSuccess(data, status = 200) {
  return {
    data,
    status,
  };
}
