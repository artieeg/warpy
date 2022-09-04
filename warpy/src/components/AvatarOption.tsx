import {useStore} from '@app/store';
import React from 'react';
import {View, TouchableOpacity, useWindowDimensions} from 'react-native';
import FastImage from 'react-native-fast-image';

export const AvatarOption = ({
  avatar,
  index,
}: {
  avatar: string;
  index: number;
}) => {
  const gifHeight = (useWindowDimensions().width - 80) / 1.2;
  const gifWidth = (useWindowDimensions().width - 50) / 2;

  //https://github.com/DylanVann/react-native-fast-image/issues/548
  return (
    <TouchableOpacity
      key={`${avatar}/${index}`}
      onPress={() => useStore.setState({signUpAvatar: avatar})}
      style={{
        height: index === 1 ? gifHeight - 50 : gifHeight,
        transform: index !== 1 && index % 2 === 1 ? [{translateY: -50}] : [],
        position: 'relative',
        width: gifWidth,
        marginBottom: 10,
        borderRadius: 25,
        overflow: 'hidden',
      }}>
      <FastImage
        resizeMode={FastImage.resizeMode.cover}
        source={{uri: avatar}}
        style={{
          zIndex: 0,
          flex: 1,
          borderRadius: 25,
          backgroundColor: '#3030ff',
        }}
      />
      <View
        style={{
          position: 'absolute',
          borderRadius: 25,
          borderWidth: 1,
          width: '100%',
          borderColor: 'transparent',
          height: index === 1 ? gifHeight - 50 : gifHeight,
          zIndex: 10,
        }}
      />
    </TouchableOpacity>
  );
};
