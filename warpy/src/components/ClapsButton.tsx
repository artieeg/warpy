import {StyleSheet} from 'react-native';
import {useStore} from '@app/store';
import React from 'react';
import {Reaction} from './Reaction';
import {IRoundButtonProps, RoundButton} from './RoundButton';

export const ClapButton = (props: IRoundButtonProps) => {
  const reaction = useStore.use.reaction();

  return (
    <RoundButton {...props} style={[styles.transparent, props.style]}>
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
