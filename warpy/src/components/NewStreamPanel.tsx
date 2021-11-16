import {useStore} from '@app/store';
import React, {useMemo} from 'react';
import {View, StyleSheet, useWindowDimensions, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {HostNewStreamButton} from './HostNewStreamButton';
import {InviteButton} from './InviteButton';
import {PendingInvites} from './PendingInvites';
import {SwitchCameraButton} from './SwitchCameraButton';
import {textStyles} from './Text';
import {ToggleCameraButton} from './ToggleCameraButton';
import {ToggleMicButton} from './ToggleMicButton';

export const useNewStreamPanelController = () => {
  const gradientHeightStyle = {height: useWindowDimensions().height / 3.4};

  return {
    gradientHeightStyle,
  };
};

export const NewStreamPanel = () => {
  const {gradientHeightStyle} = useNewStreamPanelController();
  const set = useStore.use.set();

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        pointerEvents="none"
        style={[styles.gradientBottom, gradientHeightStyle]}
        start={{x: 0, y: 0.8}}
        end={{x: 0, y: 0}}
        colors={['#050505fa', '#05050500']}
      />

      <LinearGradient
        pointerEvents="none"
        style={[styles.gradientTop, gradientHeightStyle]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 0.8}}
        colors={['#050505fa', '#05050500']}
      />

      <TextInput
        onChangeText={v => set({title: v})}
        style={styles.titleInput}
        placeholder="stream title"
        placeholderTextColor={textStyles.info.color}
      />

      <PendingInvites style={styles.pendingInvites} />

      <View pointerEvents="box-none" style={styles.bottomButtons}>
        <ToggleCameraButton />
        <ToggleMicButton />
        <HostNewStreamButton />
        <SwitchCameraButton />
        <InviteButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleInput: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...textStyles.white,
    ...textStyles.bold,
    ...textStyles.medium,
  },
  pendingInvites: {
    position: 'absolute',
    right: 20,
    bottom: 80,
  },
});
