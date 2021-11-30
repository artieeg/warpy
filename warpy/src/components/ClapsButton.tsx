import {StyleSheet} from 'react-native';
import {useStore} from '@warpy/store';
import React from 'react';
import {Reaction} from './Reaction';
import {RoundButton} from './RoundButton';
import shallow from 'zustand/shallow';

export const ClapButton = () => {
  const [reaction, dispatchModalOpen] = useStore(
    state => [state.reaction, state.dispatchModalOpen],
    shallow,
  );

  return (
    <RoundButton
      onPress={() => dispatchModalOpen('reactions')}
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
