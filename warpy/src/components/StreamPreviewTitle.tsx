import React from 'react';
import TextTicker from 'react-native-text-ticker';
import {styles} from './Text';

interface IPreviewTitleProps {
  children: string;
}

const style = {
  paddingLeft: 10,
  marginBottom: 10,
};

export const StreamPreviewTitle = (props: IPreviewTitleProps) => {
  return (
    <TextTicker
      style={[styles.xsmall, styles.bold, styles.bright, style]}
      duration={props.children.length * 200}
      loop
      bounce
      repeatSpacer={50}
      marqueeDelay={1000}>
      {props.children}
    </TextTicker>
  );
};
