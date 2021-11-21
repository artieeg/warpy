import React from 'react';
import {Input} from './Input';

export const UserSearchInput = ({
  onChangeText,
  style,
}: {
  style?: any;
  onChangeText: (text: string) => void;
}) => {
  return (
    <Input style={style} onChangeText={onChangeText} placeholder="search" />
  );
};
