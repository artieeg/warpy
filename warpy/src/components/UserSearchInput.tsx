import React from 'react';
import {SearchInput} from './SearchInput';

export const UserSearchInput = ({
  onChangeText,
}: {
  onChangeText: (text: string) => void;
}) => {
  return <SearchInput onChangeText={onChangeText} placeholder="search" />;
};
