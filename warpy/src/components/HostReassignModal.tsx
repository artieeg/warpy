import React, {useState} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {IParticipant} from '@warpy/lib';
import {BaseSlideModal, IBaseModalProps} from './BaseSlideModal';
import {useStoreShallow} from '@app/store';
import {HostCandidate} from './HostCandidate';
import {TextButton} from '@warpy/components';

export const HostReassignModal: React.FC<IBaseModalProps> = props => {
  const [modalCurrent, hostCandidates] = useStoreShallow(state => [
    state.modalCurrent,
    Object.values(state.streamers),
    //Object.values(state.streamers).filter(u => u.id !== state.user!.id),
  ]);

  const [selected, setSelected] = useState<string>();

  const onHostReassign = React.useCallback(() => {}, [selected]);

  const onSelect = React.useCallback((id: string) => {
    setSelected(prev => {
      if (prev === id) {
        return undefined;
      } else {
        return id;
      }
    });
  }, []);

  const renderHostCandidate = React.useCallback(
    ({item}: {item: IParticipant}) => {
      return (
        <HostCandidate
          selected={selected === item.id}
          data={item}
          onPress={onSelect}
        />
      );
    },
    [selected],
  );

  return (
    <BaseSlideModal
      {...props}
      visible={modalCurrent === 'host-reassign'}
      style={styles.modal}
      title="reassign host">
      <FlatList
        data={hostCandidates}
        renderItem={renderHostCandidate}
        contentContainerStyle={styles.container}
      />

      <TextButton style={styles.button} title="reassign" disabled={!selected} />
    </BaseSlideModal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  modal: {
    height: '60%',
  },
  button: {
    marginHorizontal: 30,
    marginTop: 10,
    marginBottom: 20,
  },
});