import {useStore, useStoreShallow} from '@app/store';
import React, {useCallback} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TextButton} from '@warpy/components';
import {colors} from '../../colors';
import {BaseSlideModal} from './BaseSlideModal';
import {textStyles} from './Text';

export const AwardMessageInputModal = () => {
  return null;
  /*
  const [visible, recipent, visual, message] = useStoreShallow(state => [
    state.modalCurrent === 'award-message',
    state.modalUserToAward,
    state.pickedAwardVisual,
    state.awardMessage,
  ]);

  const onSendAward = useCallback(() => {
    console.log({visual, recipent, message});
    if (visual && recipent && message) {
      useStore.getState().dispatchSendAward(visual, recipent?.id, message);
    }
  }, [visual, recipent, message]);

  return (
    <BaseSlideModal
      title="award message"
      subtitle={`for ${recipent?.username}`}
      visible={visible}>
      <View style={styles.container}>
        <View style={styles.info}>
          {visual && (
            <FastImage source={{uri: visual}} style={styles.preview} />
          )}
          <TextInput
            multiline
            onChangeText={awardMessage =>
              useStore.getState().set({awardMessage})
            }
            placeholderTextColor={colors.boulder}
            style={styles.input}
            placeholder="type award message"
          />
        </View>
        <TextButton
          onPress={onSendAward}
          style={styles.button}
          title="send the award"
        />
      </View>
    </BaseSlideModal>
  );
   * */
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
    color: colors.white,
  },
  preview: {
    width: 80,
    borderRadius: 40,
    height: 80,
    backgroundColor: colors.mine_shaft,
  },
});
