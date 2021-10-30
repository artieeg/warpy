export type CreateBotDTO = {
  creator: string;
  name: string;
  avatar: string;
};

export type BotConfirmResponseDTO = {
  user: string;
  bot: string;
};
