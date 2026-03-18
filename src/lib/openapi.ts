import type { OpenAPIV3 } from 'openapi-types';

const accountResponse = {
  type:       'object',
  properties: {
    id:          { type: 'string',  format: 'uuid' },
    name:        { type: 'string',  example: 'Main Checking' },
    type:        { type: 'integer', example: 1, description: '1=Checking 2=Savings 3=Cash 4=Credit' },
    balance:     { type: 'number',  example: 1500.00 },
    description: { type: 'string',  nullable: true, example: 'Primary bank account' },
    createdAt:   { type: 'string',  format: 'date-time' },
    updatedAt:   { type: 'string',  format: 'date-time' },
  },
} satisfies OpenAPIV3.SchemaObject;

const categoryResponse = {
  type:       'object',
  properties: {
    id:          { type: 'integer', example: 1 },
    name:        { type: 'string',  example: 'Salary' },
    type:        { type: 'integer', example: 1, description: '1=Income 2=Expense' },
    description: { type: 'string',  nullable: true, example: 'Monthly salary' },
    createdAt:   { type: 'string',  format: 'date-time' },
  },
} satisfies OpenAPIV3.SchemaObject;

const transactionResponse = {
  type:       'object',
  properties: {
    id:           { type: 'string',  format: 'uuid' },
    accountId:    { type: 'string',  format: 'uuid' },
    accountName:  { type: 'string',  nullable: true, example: 'Main Checking' },
    categoryId:   { type: 'integer', example: 1 },
    categoryName: { type: 'string',  nullable: true, example: 'Salary' },
    description:  { type: 'string',  example: 'Monthly salary deposit' },
    amount:       { type: 'number',  example: 3000.00 },
    type:         { type: 'integer', example: 1, description: '1=Income 2=Expense' },
    date:         { type: 'string',  format: 'date', example: '2024-01-15' },
    notes:        { type: 'string',  nullable: true, example: 'January salary' },
    createdAt:    { type: 'string',  format: 'date-time' },
    updatedAt:    { type: 'string',  format: 'date-time' },
  },
} satisfies OpenAPIV3.SchemaObject;

const createAccountRequest = {
  type:     'object',
  required: ['name', 'type', 'balance'],
  properties: {
    name:        { type: 'string',  example: 'Main Checking' },
    type:        { type: 'integer', example: 1, description: '1=Checking 2=Savings 3=Cash 4=Credit' },
    balance:     { type: 'number',  example: 1500.00 },
    description: { type: 'string',  nullable: true, example: 'Primary bank account' },
  },
} satisfies OpenAPIV3.SchemaObject;

const createCategoryRequest = {
  type:     'object',
  required: ['name', 'type'],
  properties: {
    name:        { type: 'string',  example: 'Salary' },
    type:        { type: 'integer', example: 1, description: '1=Income 2=Expense' },
    description: { type: 'string',  nullable: true, example: 'Monthly salary' },
  },
} satisfies OpenAPIV3.SchemaObject;

const createTransactionRequest = {
  type:     'object',
  required: ['accountId', 'categoryId', 'description', 'amount', 'type', 'date'],
  properties: {
    accountId:   { type: 'string',  format: 'uuid' },
    categoryId:  { type: 'integer', example: 1 },
    description: { type: 'string',  example: 'Monthly salary deposit' },
    amount:      { type: 'number',  example: 3000.00 },
    type:        { type: 'integer', example: 1, description: '1=Income 2=Expense' },
    date:        { type: 'string',  format: 'date', example: '2024-01-15' },
    notes:       { type: 'string',  nullable: true, example: 'January salary' },
  },
} satisfies OpenAPIV3.SchemaObject;

export const openApiSpec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title:       'ms-financial-bff',
    description: 'Financial BFF — routes Account, Category and Transaction requests from the frontend to ms-financial-process.',
    version:     '1.0.0',
  },
  servers: [
    { url: 'http://localhost:3004', description: 'Local development' },
  ],
  tags: [
    { name: 'Health',       description: 'Service status' },
    { name: 'Accounts',     description: 'Account CRUD' },
    { name: 'Categories',   description: 'Category CRUD' },
    { name: 'Transactions', description: 'Transaction CRUD' },
  ],
  paths: {
    '/api/health': {
      get: {
        tags:        ['Health'],
        summary:     'Health check',
        operationId: 'getHealth',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/HealthResponse' } } },
          },
        },
      },
    },

    '/api/v1/accounts': {
      get: {
        tags:        ['Accounts'],
        summary:     'List all accounts',
        operationId: 'listAccounts',
        security:    [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of accounts',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/AccountResponse' } } } },
          },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      post: {
        tags:        ['Accounts'],
        summary:     'Create account',
        operationId: 'createAccount',
        security:    [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateAccountRequest' } } },
        },
        responses: {
          '201': {
            description: 'Account created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AccountResponse' } } },
          },
          '400': { description: 'Invalid data',    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized',    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    '/api/v1/accounts/{id}': {
      get: {
        tags:        ['Accounts'],
        summary:     'Get account by ID',
        operationId: 'getAccountById',
        security:    [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': { description: 'Account found',   content: { 'application/json': { schema: { $ref: '#/components/schemas/AccountResponse' } } } },
          '401': { description: 'Unauthorized',    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Not found',       content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      put: {
        tags:        ['Accounts'],
        summary:     'Update account',
        operationId: 'updateAccount',
        security:    [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateAccountRequest' } } },
        },
        responses: {
          '200': { description: 'Account updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/AccountResponse' } } } },
          '401': { description: 'Unauthorized',    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Not found',       content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      delete: {
        tags:        ['Accounts'],
        summary:     'Delete account',
        operationId: 'deleteAccount',
        security:    [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '204': { description: 'Deleted successfully' },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Not found',    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    '/api/v1/categories': {
      get: {
        tags:        ['Categories'],
        summary:     'List all categories',
        operationId: 'listCategories',
        security:    [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of categories',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/CategoryResponse' } } } },
          },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      post: {
        tags:        ['Categories'],
        summary:     'Create category',
        operationId: 'createCategory',
        security:    [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCategoryRequest' } } },
        },
        responses: {
          '201': {
            description: 'Category created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryResponse' } } },
          },
          '400': { description: 'Invalid data',  content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized',  content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    '/api/v1/categories/{id}': {
      get: {
        tags:        ['Categories'],
        summary:     'Get category by ID',
        operationId: 'getCategoryById',
        security:    [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Category found', content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryResponse' } } } },
          '401': { description: 'Unauthorized',   content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Not found',      content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      put: {
        tags:        ['Categories'],
        summary:     'Update category',
        operationId: 'updateCategory',
        security:    [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCategoryRequest' } } },
        },
        responses: {
          '200': { description: 'Category updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryResponse' } } } },
          '401': { description: 'Unauthorized',     content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Not found',        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      delete: {
        tags:        ['Categories'],
        summary:     'Delete category',
        operationId: 'deleteCategory',
        security:    [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '204': { description: 'Deleted successfully' },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Not found',    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    '/api/v1/transactions': {
      get: {
        tags:        ['Transactions'],
        summary:     'List all transactions',
        operationId: 'listTransactions',
        security:    [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of transactions',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/TransactionResponse' } } } },
          },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      post: {
        tags:        ['Transactions'],
        summary:     'Create transaction',
        operationId: 'createTransaction',
        security:    [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTransactionRequest' } } },
        },
        responses: {
          '201': {
            description: 'Transaction created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/TransactionResponse' } } },
          },
          '400': { description: 'Invalid data',  content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Unauthorized',  content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    '/api/v1/transactions/{id}': {
      get: {
        tags:        ['Transactions'],
        summary:     'Get transaction by ID',
        operationId: 'getTransactionById',
        security:    [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': { description: 'Transaction found', content: { 'application/json': { schema: { $ref: '#/components/schemas/TransactionResponse' } } } },
          '401': { description: 'Unauthorized',      content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Not found',         content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      put: {
        tags:        ['Transactions'],
        summary:     'Update transaction',
        operationId: 'updateTransaction',
        security:    [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTransactionRequest' } } },
        },
        responses: {
          '200': { description: 'Transaction updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/TransactionResponse' } } } },
          '401': { description: 'Unauthorized',        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Not found',           content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      delete: {
        tags:        ['Transactions'],
        summary:     'Delete transaction',
        operationId: 'deleteTransaction',
        security:    [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '204': { description: 'Deleted successfully' },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Not found',    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
  },

  components: {
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          status:    { type: 'string',  example: 'healthy' },
          service:   { type: 'string',  example: 'ms-financial-bff' },
          timestamp: { type: 'string',  format: 'date-time' },
        },
      },

      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Internal server error' },
        },
      },

      AccountResponse:          accountResponse,
      CategoryResponse:         categoryResponse,
      TransactionResponse:      transactionResponse,
      CreateAccountRequest:     createAccountRequest,
      CreateCategoryRequest:    createCategoryRequest,
      CreateTransactionRequest: createTransactionRequest,
    },

    securitySchemes: {
      bearerAuth: {
        type:         'http',
        scheme:       'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
