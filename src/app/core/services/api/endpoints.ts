export const ENDPOINTS = {

  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    ME: '/api/v1/auth/me'
  },

  USERS: {
    LIST: '/api/v1/users',
    CREATE: '/api/v1/users',
    UPDATE: (id: number) => `/api/v1/users/${id}`,
    DELETE: (id: number) => `/api/v1/users/${id}`
  },

  TRIPS: {
    LIST: '/api/v1/trips',
    CREATE: '/api/v1/trips',
  },

  DRIVERS: { LIST: '/api/v1/drivers' },
  PATIOS: { LIST: '/api/v1/patios' },
  SHIPPING_LINES: { LIST: '/api/v1/shipping-lines' },
  TRANSPORT_ASSISTANTS: { LIST: '/api/v1/transport-assistants' },
  TRANSPORT_COMPANIES: { LIST: '/api/v1/transport-companies' },
  CLIENTS: { LIST: '/api/v1/clients' },
  AFFILIATES: { LIST: '/api/v1/affiliates' },
  CONTAINERS: { 
    LIST: '/api/v1/containers', 
    FIND_OR_CREATE: '/api/v1/containers/find-or-create', 
  },
  FREIGHTS: {
    LIST: '/api/v1/freights', 
    CREATE: '/api/v1/freights', 
    UPDATE: (id: number) => `/api/v1/freights/${id}`,
    DELETE: (id: number) => `/api/v1/freights/${id}`,
  },
  OPERATIONS: { LIST: '/api/v1/operations' },
  VEHICLES: { LIST: '/api/v1/vehicles' },

};