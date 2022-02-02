import {Input, ScreenHeader} from '@app/components';
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  SectionList,
  FlatList,
} from 'react-native';
import {useDebounce} from 'use-debounce/lib';
import {APIClient} from '@warpy/api';
import {Text} from '@app/components';
import {colors} from '../../colors';
import {useQuery} from 'react-query';
import {useStore} from '@app/store';

const search = async (api: APIClient, query: string) => {
  const [{users}, {streams}] = await Promise.all([
    api.user.search(query),
    api.stream.search(query),
  ]);

  return {
    users,
    streams,
  };
};

export const useSearchController = () => {
  const [query, setQuery] = useState('');
  const [debounced] = useDebounce(query, 300);
  const api = useStore.use.api();

  const runSearchRequests = React.useCallback(
    () => search(api, debounced),
    [api, debounced],
  );

  const {data: result, isLoading} = useQuery(
    ['search', debounced],
    runSearchRequests,
    {enabled: debounced.length >= 3},
  );

  const {users, streams} = result ?? {};

  return {setQuery, isLoading, users, streams};
};

export const Search = () => {
  const {setQuery, isLoading, users, streams} = useSearchController();

  console.log({users});

  return (
    <View style={styles.wrapper}>
      <ScreenHeader />
      <Input
        onChangeText={setQuery}
        placeholder="search people and rooms"
        style={styles.input}
      />
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color={colors.green} />
        </View>
      )}

      {/*!isLoading && (
        <SectionList
          style={styles.list}
          renderItem={({item, section: {kind}}) => ()}
          sections={[
            {
              title: 'people',
              kind: 'people',
              data: (users as any) ?? [],
            },

            {
              title: 'streams',
              kind: 'streams',
              data: (streams as any) ?? [],
            },
          ]}
        />
      )*/}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.black,
  },
  input: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
});
