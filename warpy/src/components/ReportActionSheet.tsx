import React from 'react';
import {REPORT_REASONS} from '@warpy/lib';
import {ActionSheet, IActionSheetProps} from './ActionSheet';
import {useStore} from '@app/store';

interface IReportActionSheetProps extends Omit<IActionSheetProps, 'actions'> {
  user: string | null;
}

export const ReportActionSheet = (props: IReportActionSheetProps) => {
  const {user} = props;
  const api = useStore.use.api();

  return (
    <ActionSheet
      {...props}
      actions={REPORT_REASONS.map(({title, id}) => ({
        title,
        onPress: async () => {
          if (user) {
            await api.user.report(user, id);
          }
        },
      }))}
    />
  );
};
