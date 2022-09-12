import React from 'react';
import {REPORT_REASONS} from '@warpy/lib';
import {ActionSheet} from './ActionSheet';
import {useStoreShallow} from '@app/store';
import {useModalRef} from '@app/hooks/useModalRef';

export const ReportActionSheet = () => {
  const [user, api] = useStoreShallow(state => [
    state.modalSelectedUser,
    state.api,
  ]);

  const ref = useModalRef('reports');

  return (
    <ActionSheet
      ref={ref}
      onHide={() => {
        ref.current?.close();
      }}
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
