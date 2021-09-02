import React from 'react';
import {BaseSlideModal} from './BaseSlideModal';
import {FlatList, StyleSheet, useWindowDimensions, View} from 'react-native';
import {ReactionButton} from './ReactionButton';
import {reactionCodes} from './Reaction';

interface IReactionsProps {
  visible: boolean;
  onHide: () => void;
}

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

export const Reactions = (props: IReactionsProps) => {
  const {visible, onHide} = props;

  return (
    <BaseSlideModal
      onHide={onHide}
      visible={visible}
      title="Pick current reaction">
      <FlatList
        style={styles.list}
        numColumns={5}
        data={reactionCodes}
        renderItem={({item}) => (
          <ReactionContainer>
            <ReactionButton onPress={() => {}} code={item} />
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
