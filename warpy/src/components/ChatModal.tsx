import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {BaseSlideModal, IBaseModalProps} from './BaseSlideModal';
import {Text} from './Text';

interface IChatModalOptions extends IBaseModalProps {}

export const ChatModal = (props: IChatModalOptions) => {
  const [visible, setVisible] = useState(false);

  return (
    <BaseSlideModal {...props}>
      <Text>Hello</Text>
    </BaseSlideModal>
  );
};

const styles = StyleSheet.create({});
