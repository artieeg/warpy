import {StyleSheet} from 'react-native';
import {useDispatcher, useStore} from '@app/store';
import React from 'react';
import {Reaction} from './Reaction';
import {RoundButton} from './RoundButton';

export const ReactionSelectButton = () => {
  const reaction = useStore(state => state.reaction);
  const dispatch = useDispatcher();

  return (
    <RoundButton
      onPress={() => dispatch(({modal}) => modal.open('reactions'))}
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
