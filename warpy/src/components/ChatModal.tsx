import {useStore} from '@app/store';
import React, {useCallback, useRef} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {BaseSlideModal, IBaseModalProps} from './BaseSlideModal';
import {ChatMessage} from './ChatMessage';
import {ChatMessageInput} from './ChatMessageInput';

interface IChatModalOptions extends IBaseModalProps {}

export const ChatModal = (props: IChatModalOptions) => {
  const messages = useStore.use.messages();

  const flatListRef = useRef<any>();
  const scrollPositionRef = useRef(0);

  const onItemsChanged = useCallback(() => {
    flatListRef.current?.scrollToOffset({
      animated: false,
      offset: scrollPositionRef.current,
    });
  }, []);

  return (
    <BaseSlideModal {...props}>
      <FlatList
        ref={flatListRef}
        style={styles.list}
        inverted
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        data={messages}
        renderItem={({item}) => <ChatMessage key={item.id} message={item} />}
        onViewableItemsChanged={onItemsChanged}
        onScroll={event =>
          (scrollPositionRef.current = event.nativeEvent.contentOffset.y)
        }
      />
      <ChatMessageInput />
    </BaseSlideModal>
  );
};

const styles = StyleSheet.create({
  list: {
    height: 400,
  },
});
