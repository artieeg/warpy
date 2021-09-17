import {useChatMessages} from '@app/store/selectors';
import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {BaseSlideModal, IBaseModalProps} from './BaseSlideModal';
import {ChatMessage} from './ChatMessage';

interface IChatModalOptions extends IBaseModalProps {}

export const ChatModal = (props: IChatModalOptions) => {
  const messages = useChatMessages();

  return (
    <BaseSlideModal {...props}>
      <FlatList
        style={styles.list}
        inverted
        data={messages}
        renderItem={({item}) => <ChatMessage key={item.id} message={item} />}
      />
    </BaseSlideModal>
  );
};

const styles = StyleSheet.create({
  list: {
    height: 400,
  },
});
