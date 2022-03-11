export const REQUIRED_ENV_KEYS = [
  'TENOR_KEY',
  'TWILIO_SID',
  'TWILIO_AUTH',
  'SENDGRID_API_KEY',
  'URL',
];

export const configuration = () => ({
  accessJwtSecret: process.env.JWT_SECRET || 'test-secret',
  tenorAPIKey: process.env.TENOR_KEY,
  isProduction: process.env.NODE === 'production',
  userOnlineStatusCache:
    process.env.USER_ONLINE_STATUS ?? 'redis://127.0.0.1/7',
  mediaServerIdsCache: process.env.MEDIA_SERVER_IDS ?? 'redis://127.0.0.1/6',
  mediaNodeInfo: process.env.MEDIA_NODE_INFO_ADDR ?? 'redis://127.0.0.1/5',
  mediaStreamNodeAssigner:
    process.env.MEDIA_STREAM_NODE_ASSIGNER_ADDR ?? 'redis://127.0.0.1/4',
  nats: process.env.NATS_ADDR ?? '127.0.0.1',
  twilioSID: process.env.TWILIO_SID,
  twilioAuth: process.env.TWILIO_AUTH,
  sendGridKey: process.env.SENDGRID_API_KEY,
  url: process.env.URL,
  blockCacheAddr: process.env.BLOCK_CACHE_ADDR,
  previousStreamCacheAddr: process.env.PREVIOUS_STREAM_CACHE_ADDR,
  participantStoreAddr: process.env.PARTICIPANT_STORE_ADDR,
  broadcastUserListStoreAddr: process.env.BROADCAST_USER_LIST_STORE_ADDR,
});
