export const configuration = () => ({
  accessJwtSecret: process.env.JWT_SECRET || 'test-secret',
});
