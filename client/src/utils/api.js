const BASE_URL = 'http://localhost:5000/api'

const getToken = () => localStorage.getItem('fp_token') || localStorage.getItem('token')

const request = async (path, options = {}) => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  } catch {
    throw new Error('Network error. Please check your connection and try again.')
  }

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Request failed (${response.status})`)
  }

  return data
}

export const registerUser = async (data) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const loginUser = async (data) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const uploadFile = async (file) => {
  const token = getToken()
  const formData = new FormData()
  formData.append('file', file)

  let response
  try {
    response = await fetch(`${BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    })
  } catch {
    throw new Error('Network error. Please check your connection and try again.')
  }

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Upload failed (${response.status})`)
  }

  return data
}

export const convertFile = async (file) => {
  const token = getToken()
  const formData = new FormData()
  formData.append('file', file)

  // Choose endpoint based on file MIME type
  const isImage = (file && file.type && file.type.startsWith('image/')) || (file && /\.(jpe?g|png)$/i.test(file.name))
  const isPdf = (file && file.type === 'application/pdf') || (file && file.name && file.name.toLowerCase().endsWith('.pdf'))

  const endpoint = isImage ? '/files/jpg-to-pdf' : isPdf ? '/files/convert' : null
  if (!endpoint) throw new Error('Unsupported file type for conversion')

  let response
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    })
  } catch {
    throw new Error('Network error. Please check your connection and try again.')
  }

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Conversion failed (${response.status})`)
  }

  return data
}

export const convertPdfToDocx = async (file) => {
  const token = getToken()
  const formData = new FormData()
  formData.append('file', file)

  let response
  try {
    response = await fetch(`${BASE_URL}/files/convert`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    })
  } catch {
    throw new Error('Network error. Please check your connection and try again.')
  }

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Conversion failed (${response.status})`)
  }

  return data
}

export const convertPdfToJpg = async (file) => {
  const token = getToken()
  const formData = new FormData()
  formData.append('file', file)

  let response
  try {
    response = await fetch(`${BASE_URL}/files/pdf-to-jpg`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    })
  } catch {
    throw new Error('Network error. Please check your connection and try again.')
  }

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Conversion failed (${response.status})`)
  }

  return data
}

export const convertJpgToPdf = async (file) => {
  const token = getToken()
  const formData = new FormData()
  formData.append('file', file)

  let response
  try {
    response = await fetch(`${BASE_URL}/files/jpg-to-pdf`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    })
  } catch {
    throw new Error('Network error. Please check your connection and try again.')
  }

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Conversion failed (${response.status})`)
  }

  return data
}

export const getUsageInfo = async () => request('/files/usage', { method: 'GET' })

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
}
