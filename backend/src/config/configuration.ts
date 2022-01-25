export const REQUIRED_ENV_KEYS = ['TENOR_KEY', 'TWILIO_SID', 'TWILIO_AUTH'];

export const configuration = () => ({
  accessJwtSecret: process.env.JWT_SECRET || 'test-secret',
  tenorAPIKey: process.env.TENOR_KEY,
  isProduction: process.env.NODE === 'production',
  userOnlineStatusCache:
    process.env.USER_ONLINE_STATUS ?? 'redis://127.0.0.1/7',
  mediaServerIdsCache: process.env.MEDIA_SERVER_IDS ?? 'redis://127.0.0.1/6',
  nats: process.env.NATS_ADDR ?? '127.0.0.1',
  twilioSID: process.env.TWILIO_SID,
  twilioAuth: process.env.TWILIO_AUTH,
});
