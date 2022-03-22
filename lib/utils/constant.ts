export const server =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://rua.plus';
