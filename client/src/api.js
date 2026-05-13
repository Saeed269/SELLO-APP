const BASE_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Helper que hace fetch al backend con el token JWT de Supabase.
 * @param {string} endpoint - Ruta de la API, ej: '/api/negocios'
 * @param {string} token - JWT token del usuario autenticado
 * @param {object} options - Opciones adicionales de fetch (method, body, etc.)
 */
const apiRequest = async (endpoint, token, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición');
  }

  return data;
};

export const negociosApi = {
  getAll: (token) => apiRequest('/api/negocios', token),
  getById: (token, id) => apiRequest(`/api/negocios/${id}`, token),
  create: (token, body) => apiRequest('/api/negocios', token, { method: 'POST', body: JSON.stringify(body) }),
  update: (token, id, body) => apiRequest(`/api/negocios/${id}`, token, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (token, id) => apiRequest(`/api/negocios/${id}`, token, { method: 'DELETE' }),
};

export const clientesApi = {
  getAll: (token) => apiRequest('/api/clientes', token),
  getById: (token, id) => apiRequest(`/api/clientes/${id}`, token),
  create: (token, body) => apiRequest('/api/clientes', token, { method: 'POST', body: JSON.stringify(body) }),
  update: (token, id, body) => apiRequest(`/api/clientes/${id}`, token, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (token, id) => apiRequest(`/api/clientes/${id}`, token, { method: 'DELETE' }),
};

export const tarjetasApi = {
  getAll: (token) => apiRequest('/api/tarjetas', token),
  getById: (token, id) => apiRequest(`/api/tarjetas/${id}`, token),
  create: (token, body) => apiRequest('/api/tarjetas', token, { method: 'POST', body: JSON.stringify(body) }),
  addSello: (token, id) => apiRequest(`/api/tarjetas/${id}/sello`, token, { method: 'POST' }),
  delete: (token, id) => apiRequest(`/api/tarjetas/${id}`, token, { method: 'DELETE' }),
};