import React from 'react';
import {REPORT_REASONS} from '@warpy/lib';
import {ActionSheet, IActionSheetProps} from './ActionSheet';

interface IReportActionSheetProps extends Omit<IActionSheetProps, 'actions'> {}

export const ReportActionSheet = (props: IReportActionSheetProps) => {
  return (
    <ActionSheet
      {...props}
      actions={REPORT_REASONS.map(({title, id}) => ({
        title,
        onPress: () => {
          //TODO: call reports api
        },
      }))}
    />
  );
};
