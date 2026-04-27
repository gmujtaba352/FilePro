const BASE = '/api'

const getToken = () => localStorage.getItem('fp_token')

const request = async (path, options = {}) => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  let response
  try {
    response = await fetch(`${BASE}${path}`, { ...options, headers })
  } catch {
    throw new Error('Network error. Please check your connection and try again.')
  }

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`)
  }

  return data
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
}
