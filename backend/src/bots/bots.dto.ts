export type CreateBotDTO = {
  creator: string;
  name: string;
  botname: string;
  avatar: string;
};

export type BotConfirmResponseDTO = {
  user: string;
  bot: string;
  confirmed: boolean;
};
