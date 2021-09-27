import { InviteService } from "@backend/services";

import {
  IInviteSuggestionsRequest,
  IInviteSuggestionsResponse,
  MessageHandler,
} from "@warpy/lib";

export const onInviteSuggestionsRequest: MessageHandler<
  IInviteSuggestionsRequest,
  IInviteSuggestionsResponse
> = async (data, respond) => {
  const { stream, user } = data;

  const suggestions = await InviteService.getInviteSuggestions(user, stream);

  respond({
    suggestions,
  });
};
