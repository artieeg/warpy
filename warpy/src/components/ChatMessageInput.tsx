import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {textStyles} from './Text';
import {SendMessageButton} from './SendMessageButton';
import {useDispatcher, useStoreShallow} from '@app/store';
import {colors} from '@app/theme';

export const ChatMessageInput = () => {
  const dispatch = useDispatcher();
  const messageInputValue = useStoreShallow(state => state.messageInputValue);

  return (
    <View style={styles.wrapper}>
      <TextInput
        value={messageInputValue}
        numberOfLines={1}
        returnKeyType="send"
        onChangeText={text => {
          dispatch(({chat}) => chat.setMessageInput(text));
        }}
        onSubmitEditing={() => {
          dispatch(({chat}) => chat.send());
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
          dispatch(({chat}) => chat.send());
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
