import { vi } from 'vitest';

export type MockQueryBuilder = {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
};

export type MockStorageBucket = {
  remove: ReturnType<typeof vi.fn>;
  createSignedUploadUrl: ReturnType<typeof vi.fn>;
};

export type MockSupabaseClient = {
  auth: {
    getUser: ReturnType<typeof vi.fn>;
    signUp: ReturnType<typeof vi.fn>;
    signInWithPassword: ReturnType<typeof vi.fn>;
    signOut: ReturnType<typeof vi.fn>;
    resetPasswordForEmail: ReturnType<typeof vi.fn>;
    updateUser: ReturnType<typeof vi.fn>;
  };
  from: ReturnType<typeof vi.fn>;
  storage: {
    from: ReturnType<typeof vi.fn>;
  };
  _queryBuilder: MockQueryBuilder;
  _storageBucket: MockStorageBucket;
};

export function createMockQueryBuilder(): MockQueryBuilder {
  const builder: MockQueryBuilder = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn(),
    single: vi.fn(),
  };

  // Each chainable method returns the builder itself
  builder.select.mockReturnValue(builder);
  builder.insert.mockReturnValue(builder);
  builder.update.mockReturnValue(builder);
  builder.delete.mockReturnValue(builder);
  builder.eq.mockReturnValue(builder);

  return builder;
}

export function createMockStorageBucket(): MockStorageBucket {
  return {
    remove: vi.fn().mockResolvedValue({ error: null }),
    createSignedUploadUrl: vi.fn(),
  };
}

export function createMockSupabaseClient(): MockSupabaseClient {
  const queryBuilder = createMockQueryBuilder();
  const storageBucket = createMockStorageBucket();

  const client: MockSupabaseClient = {
    auth: {
      getUser: vi.fn(),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    },
    from: vi.fn().mockReturnValue(queryBuilder),
    storage: {
      from: vi.fn().mockReturnValue(storageBucket),
    },
    _queryBuilder: queryBuilder,
    _storageBucket: storageBucket,
  };

  return client;
}
