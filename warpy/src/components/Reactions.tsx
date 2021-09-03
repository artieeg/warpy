import React from 'react';
import {BaseSlideModal} from './BaseSlideModal';
import {FlatList, StyleSheet, useWindowDimensions, View} from 'react-native';
import {ReactionButton} from './ReactionButton';
import {reactionCodes} from './Reaction';

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
  onHide: () => void;
  onPickReaction: (reaction: string) => void;
}

export const Reactions = (props: IReactionsProps) => {
  const {visible, onHide, onPickReaction} = props;

  return (
    <BaseSlideModal
      onHide={onHide}
      visible={visible}
      title="pick your reaction">
      <FlatList
        style={styles.list}
        numColumns={5}
        data={reactionCodes}
        renderItem={({item}) => (
          <ReactionContainer>
            <ReactionButton
              onPress={() => {
                onPickReaction(item);
                onHide();
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
