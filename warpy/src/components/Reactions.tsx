import React from 'react';
import {BaseSlideModal} from './BaseSlideModal';
import {FlatList, StyleSheet, useWindowDimensions, View} from 'react-native';
import {ReactionOptionButton} from './ReactionOptionButton';
import {reactionCodes} from './Reaction';
import {useDispatcher} from '@app/store';
import {useModalRef} from '@app/hooks/useModalRef';

const ReactionContainer = (props: any) => {
  const {width} = useWindowDimensions();

  const side = (width - 20 * 2) / 5;

  const style = {
    width: side,
    height: side,
    alignItems: 'center',
    justifyContent: 'center',
  };

  return <View {...props} style={style} />;
};

export const Reactions = () => {
  const ref = useModalRef('reactions');
  const dispatch = useDispatcher();

  return (
    <BaseSlideModal ref={ref} title="pick your reaction">
      <FlatList
        style={styles.list}
        numColumns={5}
        data={reactionCodes}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <ReactionContainer>
            <ReactionOptionButton
              onPress={() => {
                dispatch(({stream}) => stream.changeReaction(item));
                dispatch(({modal}) => modal.close());
                ref.current?.close();
              }}
              code={item}
            />
          </ReactionContainer>
        )}
      />
    </BaseSlideModal>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 20,
  },
});
