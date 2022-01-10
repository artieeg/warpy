import {useStoreShallow} from '@app/store';
import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TextButton} from '../../../packages/shared-components';
import {colors} from '../../colors';
import {BaseSlideModal} from './BaseSlideModal';
import {textStyles} from './Text';

export const AwardMessageInputModal = () => {
  const [visible, username, visual] = useStoreShallow(state => [
    state.modalCurrent === 'award-message',
    state.modalSelectedUser?.username,
    state.pickedAwardVisual,
  ]);

  return (
    <BaseSlideModal title="award message" subtitle={`for ${username}`} visible>
      <View style={styles.container}>
        <View style={styles.info}>
          {visual && (
            <FastImage source={{uri: visual}} style={styles.preview} />
          )}
          <TextInput
            multiline
            placeholderTextColor={colors.boulder}
            style={styles.input}
            placeholder="type award message"
          />
        </View>
        <TextButton style={styles.button} title="send the award" />
      </View>
    </BaseSlideModal>
  );
};

const styles = StyleSheet.create({
  info: {
    flexDirection: 'row',
  },
  button: {
    marginVertical: 20,
  },
  container: {
    marginTop: 20,
    paddingHorizontal: 30,
  },
  input: {
    fontFamily: textStyles.bold.fontFamily,
    fontSize: 18,
    paddingLeft: 10,
    textAlignVertical: 'top',
    flex: 1,
  },
  preview: {
    width: 80,
    borderRadius: 40,
    height: 80,
    backgroundColor: colors.mine_shaft,
  },
});
