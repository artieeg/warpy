import {useStore} from '@app/store';
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {ActionSheet} from './ActionSheet';
import {Text} from './Text';

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
