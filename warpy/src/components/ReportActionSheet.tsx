import React from 'react';
import {REPORT_REASONS} from '@warpy/lib';
import {ActionSheet, IActionSheetProps} from './ActionSheet';
import {useStore} from '@app/store';

interface IReportActionSheetProps extends Omit<IActionSheetProps, 'actions'> {}

export const ReportActionSheet = (props: IReportActionSheetProps) => {
  const user = useStore(state => state.modalSelectedUser);
  const api = useStore(state => state.api);

  return (
    <ActionSheet
      {...props}
      actions={REPORT_REASONS.map(({title, id}) => ({
        title,
        onPress: async () => {
          if (user) {
            await api.user.report(user.id, id);
          }
        },
      }))}
    />
  );
};
