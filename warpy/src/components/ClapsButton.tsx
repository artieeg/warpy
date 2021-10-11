import {StyleSheet} from 'react-native';
import {useStore} from '@app/store';
import React from 'react';
import {Reaction} from './Reaction';
import {RoundButton} from './RoundButton';

export const ClapButton = () => {
  const reaction = useStore.use.reaction();
  const openNewModal = useStore.use.openNewModal();

  return (
    <RoundButton
      onPress={() => openNewModal('reactions')}
      style={styles.transparent}>
      <Reaction code={reaction} />
    </RoundButton>
  );
};

const styles = StyleSheet.create({
  transparent: {
    backgroundColor: '#00000000',
  },
});

export default styles;
