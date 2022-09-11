import {useModalRef} from '@app/hooks/useModalRef';
import {useStore} from '@app/store';
import React, {useCallback, useRef} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {BaseSlideModal} from './BaseSlideModal';
import {ChatMessage} from './ChatMessage';
import {ChatMessageInput} from './ChatMessageInput';

export const ChatModal = () => {
  const messages = useStore(state => state.messages);

  const ref = useModalRef('chat');
  const flatListRef = useRef<any>();
  const scrollPositionRef = useRef(0);

  const onItemsChanged = useCallback(() => {
    flatListRef.current?.scrollToOffset({
      animated: false,
      offset: scrollPositionRef.current,
    });
  }, []);

  return (
    <BaseSlideModal ref={ref}>
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
