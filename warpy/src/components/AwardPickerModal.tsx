import {useStore} from '@app/store';
import React, {useCallback, useState} from 'react';
import {FlatList, StyleSheet, useWindowDimensions, View} from 'react-native';
import shallow from 'zustand/shallow';
import {BaseSlideModal, IBaseModalProps} from './BaseSlideModal';
import {Text} from './Text';
import {AwardOption} from './AwardOption';
import {useAvailableAwards} from '@app/hooks';
import {useCoinBalance} from '@app/hooks/useCoinBalance';
import {CoinBalance} from './CoinBalance';
import {TextButton} from './TextButton';

export const AwardPickerModal = (props: IBaseModalProps) => {
  const [pickedAwardId, setPickedAwardId] = useState<string>();

  const [api, visible, username, dispatchSendAward] = useStore(
    useCallback(
      state => [
        state.api,
        state.modalCurrent === 'award',
        state.modalUserToAward
          ? state.streamers[state.modalUserToAward]?.username
          : null,
        state.dispatchSendAward,
      ],
      [],
    ),
    shallow,
  );

  const {data: awardsResponse} = useAvailableAwards(api);
  const {data: coinBalanceResponse} = useCoinBalance(api);

  const cellWidth =
    (useWindowDimensions().width - styles.wrapper.paddingHorizontal * 2) / 4;

  const minHeight = useWindowDimensions().height * 0.8;

  const cellStyle = {
    width: cellWidth,
    height: cellWidth + 40,
    //overflow: 'hidden',
  };

  return (
    <BaseSlideModal
      {...props}
      style={{minHeight}}
      visible={visible}
      title="send award">
      <View style={styles.wrapper}>
        <Text size="xsmall" color="info">
          to @{username}
        </Text>
        <CoinBalance
          balance={coinBalanceResponse?.balance}
          style={styles.balance}
        />
        <FlatList
          contentContainerStyle={styles.containerStyle}
          numColumns={4}
          data={awardsResponse?.awards}
          renderItem={({item}) => (
            <View style={[cellStyle, styles.cell]}>
              <AwardOption
                onPick={() =>
                  setPickedAwardId(prev =>
                    prev === item.id ? undefined : item.id,
                  )
                }
                picked={pickedAwardId === item.id}
                award={item}
              />
            </View>
          )}
        />

        <View style={styles.button}>
          <TextButton
            onPress={() => pickedAwardId && dispatchSendAward(pickedAwardId)}
            disabled={!pickedAwardId}
            title={
              pickedAwardId ? 'send the award' : 'select the award to send'
            }
          />
        </View>
      </View>
    </BaseSlideModal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    flex: 1,
  },
  cell: {
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  balance: {
    position: 'absolute',
    right: 20,
    top: -20,
    borderRadius: 50,
  },
  containerStyle: {
    paddingTop: 20,
    paddingBottom: 60,
  },
  button: {
    position: 'absolute',
    paddingBottom: 15,
    backgroundColor: '#000',
    bottom: 0,
    left: 30,
    right: 30,
  },
});
