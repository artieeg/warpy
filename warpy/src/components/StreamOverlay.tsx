import React from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ClapButton} from './ClapsButton';
import {IconButton} from './IconButton';
import {ReactionButton} from './ReactionButton';
import {ShowParticipantsButton} from './ShowParticipantsButton';

export const StreamOverlay = () => {
  const gradientHeightStyle = {height: useWindowDimensions().height / 3};

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        style={[styles.gradient, gradientHeightStyle]}
        start={{x: 0, y: 0.8}}
        end={{x: 0, y: 0}}
        colors={['#050505fa', '#05050500']}
      />

      <View style={styles.buttons}>
        <ClapButton onPress={() => {}} />
        <IconButton color="#ffffff" name="mic-on" size={30} />
        <IconButton color="#ffffff" name="chat" size={30} />
        <ShowParticipantsButton
          onOpenParticipantsList={() => {}}
          style={styles.transparent}
        />
        <IconButton color="#ffffff" name="eye-off" size={30} />
      </View>
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
