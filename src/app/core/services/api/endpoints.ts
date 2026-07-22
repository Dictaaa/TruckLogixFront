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
    UPDATE: (id: number) => `/api/v1/trips/${id}`,
    DELETE: (id: number) => `/api/v1/trips/${id}`,
    PRODUCTION_AFFILIATES: '/api/v1/trips/production/affiliates',
  },

  DRIVERS: { LIST: '/api/v1/drivers', CREATE: '/api/v1/drivers', UPDATE: (id: number) => `/api/v1/drivers/${id}`, DELETE: (id: number) => `/api/v1/drivers/${id}` },
  PATIOS: { LIST: '/api/v1/patios', CREATE: '/api/v1/patios', UPDATE: (id: number) => `/api/v1/patios/${id}`, DELETE: (id: number) => `/api/v1/patios/${id}` },
  SHIPPING_LINES: { LIST: '/api/v1/shipping-lines', CREATE: '/api/v1/shipping-lines', UPDATE: (id: number) => `/api/v1/shipping-lines/${id}`, DELETE: (id: number) => `/api/v1/shipping-lines/${id}` },
  TRANSPORT_ASSISTANTS: { LIST: '/api/v1/transport-assistants', CREATE: '/api/v1/transport-assistants', UPDATE: (id: number) => `/api/v1/transport-assistants/${id}`, DELETE: (id: number) => `/api/v1/transport-assistants/${id}` },
  TRANSPORT_COMPANIES: { LIST: '/api/v1/transport-companies', CREATE: '/api/v1/transport-companies', UPDATE: (id: number) => `/api/v1/transport-companies/${id}`, DELETE: (id: number) => `/api/v1/transport-companies/${id}` },
  CLIENTS: { LIST: '/api/v1/clients', CREATE: '/api/v1/clients', UPDATE: (id: number) => `/api/v1/clients/${id}`, DELETE: (id: number) => `/api/v1/clients/${id}` },
  AFFILIATES: { LIST: '/api/v1/affiliates' },
  CONTAINERS: { 
    LIST: '/api/v1/containers', 
    CREATE: '/api/v1/containers', 
    UPDATE: (id: number) => `/api/v1/containers/${id}`, 
    DELETE: (id: number) => `/api/v1/containers/${id}`,
    FIND_OR_CREATE: '/api/v1/containers/find-or-create', 
  },
  FREIGHTS: {
    LIST: '/api/v1/freights', 
    CREATE: '/api/v1/freights', 
    UPDATE: (id: number) => `/api/v1/freights/${id}`,
    DELETE: (id: number) => `/api/v1/freights/${id}`,
  },
  OPERATIONS: { LIST: '/api/v1/operations', CREATE: '/api/v1/operations', UPDATE: (id: number) => `/api/v1/operations/${id}`, DELETE: (id: number) => `/api/v1/operations/${id}` },
  VEHICLES: { LIST: '/api/v1/vehicles', CREATE: '/api/v1/vehicles', UPDATE: (id: number) => `/api/v1/vehicles/${id}`, DELETE: (id: number) => `/api/v1/vehicles/${id}` },
  DASHBOARD: { LIST: '/api/v1/dashboard' },
  BUDGETS: {
    LIST: '/api/v1/affiliate-budgets',
    CREATE: '/api/v1/affiliate-budgets',
    UPSERT_MANY: '/api/v1/affiliate-budgets/bulk',
    UPDATE: (id: number) => `/api/v1/affiliate-budgets/${id}`,
    DELETE: (id: number) => `/api/v1/affiliate-budgets/${id}`
  },
  FUEL_LOGS: {
  LIST:         '/api/v1/fuel-logs',
  CREATE:       '/api/v1/fuel-logs',
  UPDATE: (id: number) => `/api/v1/fuel-logs/${id}`,
  DELETE: (id: number) => `/api/v1/fuel-logs/${id}`,
},
};