import React, {useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {textStyles} from './Text';
import {SendMessageButton} from './SendMessageButton';
import {useStore, useStoreShallow} from '@app/store';
import {colors} from '../../colors';

export const ChatMessageInput = () => {
  const [messageInputValue] = useStoreShallow(state => [
    state.messageInputValue,
  ]);

  return (
    <View style={styles.wrapper}>
      <TextInput
        value={messageInputValue}
        numberOfLines={1}
        returnKeyType="send"
        onChangeText={useStore.getState().dispatchSetChatInput}
        onSubmitEditing={() => {
          useStore.getState().dispatchChatSendMessage();
        }}
        style={[
          textStyles.bold,
          textStyles.xsmall,
          {color: colors.white},
          styles.input,
        ]}
        placeholderTextColor={colors.boulder}
        placeholder="type your message"
      />
      <SendMessageButton
        onPress={() => {
          useStore.getState().dispatchChatSendMessage();
        }}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 10,
    marginBottom: 10,
    paddingLeft: 30,
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#474141',
    borderRadius: 25,
  },
  input: {
    flex: 1,
  },
  button: {
    backgroundColor: '#474141',
  },
});
