import {useStore} from '@app/store';
import React from 'react';
import {ActionSheet} from './ActionSheet';

interface IUserActionSheetProps {
  user: string | null;
  visible: boolean;
  onHide: () => void;
  onReportUser: () => void;
}

export const UserActionSheet = (props: IUserActionSheetProps) => {
  const {user, onReportUser} = props;

  const api = useStore.use.api();

  const isStreamOwner = useStore.use.isStreamOwner();

  return (
    <ActionSheet
      {...props}
      actions={[
        {
          title: 'block',
          color: 'alert',
          onPress: async () => {
            if (user) {
              await api.user.block(user);
            }
          },
        },
        {
          title: 'report',
          color: 'alert',
          onPress: () => {
            onReportUser();
          },
        },
        isStreamOwner
          ? {
              title: 'kick',
              color: 'alert',
              onPress: () => {
                if (user) {
                  api.stream.kickUser(user);
                }
              },
            }
          : null,
        {
          title: 'follow',
        },
      ]}
    />
  );
};
