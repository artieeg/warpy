import { AppInviteAlreadyAccepted, CantInviteYourself } from '@warpy-be/errors';
import { getMockedInstance } from '@warpy-be/utils';
import { createAppInviteFixture } from '@warpy-be/__fixtures__';
import { when } from 'jest-when';
import { AppInviteService } from './app-invite.service';
import { AppInviteStore } from './app-invite.store';
import { AppliedAppInviteStore } from './applied-app-invite.store';

describe('AppInviteService', () => {
  const appInviteStore = getMockedInstance<AppInviteStore>(AppInviteStore);
  const appliedAppInviteStore = getMockedInstance<AppliedAppInviteStore>(
    AppliedAppInviteStore,
  );

  const invite = createAppInviteFixture();

  appInviteStore.create.mockResolvedValue(invite);

  const acceptedBy = 'accepted_by_id';
  const alreadyAccepted = 'already_accepted_by_id';

  when(appliedAppInviteStore.find)
    .calledWith(acceptedBy)
    .mockResolvedValue(null);
  when(appliedAppInviteStore.find)
    .calledWith(alreadyAccepted)
    .mockResolvedValue('applied_id');

  when(appInviteStore.findByCode)
    .calledWith(invite.code)
    .mockResolvedValue({ id: invite.id, user_id: invite.user.id });
  when(appInviteStore.findById).calledWith(invite.id).mockResolvedValue(invite);
  when(appInviteStore.find)
    .calledWith(invite.user.id)
    .mockResolvedValue(invite);

  const service = new AppInviteService(
    appInviteStore as any,
    appliedAppInviteStore as any,
  );

  it('creates app invite', async () => {
    expect(service.createAppInvite(invite.user)).resolves.toStrictEqual(invite);
  });

  it('find app invite by id', async () => {
    expect(service.getById(invite.id)).resolves.toStrictEqual(invite);
  });

  it('find app invite by user', async () => {
    expect(service.get(invite.user.id)).resolves.toStrictEqual(invite);
  });

  it('updates app invite', async () => {
    await service.update(invite.user.id);

    expect(appInviteStore.updateInviteCode).toBeCalledWith(invite.user.id);
  });

  it('accepts app invites', async () => {
    await service.accept(acceptedBy, invite.code);

    expect(appliedAppInviteStore.create).toBeCalledWith(acceptedBy, invite.id);
  });

  it('throws when already accepted', async () => {
    expect(service.accept(alreadyAccepted, invite.code)).rejects.toThrowError(
      AppInviteAlreadyAccepted,
    );
  });

  it('throws when accepting own invite', async () => {
    expect(service.accept(invite.user.id, invite.code)).rejects.toThrowError(
      CantInviteYourself,
    );
  });
});
