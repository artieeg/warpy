import React from 'react';
import {REPORT_REASONS} from '@warpy/lib';
import {ActionSheet} from './ActionSheet';
import {useStoreShallow} from '@app/store';
import {BaseSlideModalRefProps} from './BaseSlideModal';

export const ReportActionSheet = () => {
  const [user, api] = useStoreShallow(state => [
    state.modalSelectedUser,
    state.api,
  ]);

  const ref = React.useRef<BaseSlideModalRefProps>(null);

  return (
    <ActionSheet
      ref={ref}
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
