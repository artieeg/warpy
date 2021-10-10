import {useStore} from '@app/store';
import React from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ChatButton} from './ChatButton';
import {ClapButton} from './ClapsButton';
import {IconButton} from './IconButton';
import {RaiseHandButton} from './RaiseHandButton';
import {ShowParticipantsButton} from './ShowParticipantsButton';
import {Speakers} from './Speakers';
import {ToggleMicButton} from './ToggleMicButton';

export const StreamOverlay = () => {
  const gradientHeightStyle = {height: useWindowDimensions().height / 3};

  const role = useStore.use.role();

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        style={[styles.gradient, gradientHeightStyle]}
        start={{x: 0, y: 0.8}}
        end={{x: 0, y: 0}}
        colors={['#050505fa', '#05050500']}
      />

      <View style={styles.buttons}>
        <ClapButton />
        {role === 'viewer' && <RaiseHandButton />}
        {role === 'speaker' && <ToggleMicButton />}
        <ChatButton />
        <ShowParticipantsButton style={styles.transparent} />
        <IconButton color="#ffffff" name="eye-off" size={30} />
      </View>
      <Speakers />
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  wrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttons: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
