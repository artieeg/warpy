import React from 'react';
import TextTicker from 'react-native-text-ticker';
import {styles} from './Text';

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
        styles[props.size || 'xsmall'],
        styles.bold,
        styles.bright,
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
