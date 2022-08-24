import React from 'react';
import {BaseSlideModal} from './BaseSlideModal';
import {FlatList, StyleSheet, useWindowDimensions, View} from 'react-native';
import {ReactionOptionButton} from './ReactionOptionButton';
import {reactionCodes} from './Reaction';
import {useDispatcher, useStore} from '@app/store';

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

interface IReactionsProps {
  visible: boolean;
}

export const Reactions = (props: IReactionsProps) => {
  const {visible} = props;
  const dispatch = useDispatcher();

  return (
    <BaseSlideModal visible={visible} title="pick your reaction">
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
