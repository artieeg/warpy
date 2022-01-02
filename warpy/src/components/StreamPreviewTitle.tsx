import React from 'react';
import TextTicker from 'react-native-text-ticker';
import {colors} from '../../colors';
import {textStyles} from './Text';

interface IPreviewTitleProps {
  size?: 'xsmall' | 'medium';
  children: string;
  style?: any;
}

const style = {
  paddingLeft: 10,
  marginBottom: 10,
};

export const StreamPreviewTitle = (props: IPreviewTitleProps) => {
  return (
    <TextTicker
      style={[
        textStyles[props.size || 'xsmall'],
        textStyles.bold,
        {color: colors.white},
        style,
      ]}
      duration={props.children.length * 200}
      loop
      bounce
      repeatSpacer={50}
      marqueeDelay={1000}>
      {props.children}
    </TextTicker>
  );
};
