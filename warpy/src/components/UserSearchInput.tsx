import React from 'react';
import {SearchInput} from './SearchInput';

export const UserSearchInput = ({
  onChangeText,
  style,
}: {
  style?: any;
  onChangeText: (text: string) => void;
}) => {
  return (
    <SearchInput
      style={style}
      onChangeText={onChangeText}
      placeholder="search"
    />
  );
};
