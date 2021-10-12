export const configuration = () => ({
  accessJwtSecret: process.env.JWT_SECRET || 'test-secret',
  tenorAPIKey: process.env.TENOR_KEY
});
