import React, {useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {textStyles} from './Text';
import {SendMessageButton} from './SendMessageButton';
import {useStore} from '@app/store';

export const ChatMessageInput = () => {
  const [message, setMessage] = useState('');

  const dispatchChatSendMessage = useStore(
    state => state.dispatchChatSendMessage,
  );

  return (
    <View style={styles.wrapper}>
      <TextInput
        onChangeText={setMessage}
        style={[
          textStyles.bold,
          textStyles.xsmall,
          textStyles.bright,
          styles.input,
        ]}
        placeholderTextColor="#fff"
        placeholder="type your message"
      />
      <SendMessageButton
        onPress={() => dispatchChatSendMessage(message)}
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
