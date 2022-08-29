import {Input, ScreenHeader, StreamFeedView} from '@app/components';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator, FlatList} from 'react-native';
import {useDebounce} from 'use-debounce';
import {APIClient} from '@warpy/api';
import {Text} from '@app/components';
import {colors} from '../../colors';
import {useQuery} from 'react-query';
import {useStore} from '@app/store';
import {UserHorizontalListItem} from '@app/components/UserHorizontalListItem';

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
  const [hasResults, setHasResults] = useState<boolean>();
  const api = useStore(state => state.api);

  const runSearchRequests = React.useCallback(
    () => search(api, debounced),
    [api, debounced],
  );

  const {
    data: result,
    isLoading,
    isFetched,
  } = useQuery(['search', debounced], runSearchRequests, {
    enabled: debounced.length >= 3,
  });

  const {users, streams} = result ?? {};

  useEffect(() => {
    if (query.length < 3) {
      return setHasResults(undefined);
    }

    if (!result || !isFetched) {
      if (typeof hasResults === 'undefined') {
        return;
      }

      return setHasResults(false);
    }

    const {users, streams} = result;

    setHasResults(users.length > 0 || streams.length > 0);
  }, [result?.users, query, result?.streams]);

  return {setQuery, isLoading, users, streams, hasResults};
};

export const Search = () => {
  const {setQuery, isLoading, users, streams, hasResults} =
    useSearchController();

  return (
    <View style={styles.wrapper}>
      <ScreenHeader />
      <Input
        onChangeText={setQuery}
        placeholder="search people and rooms"
        style={styles.input}
      />
      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color={colors.green} />
        </View>
      )}

      {hasResults === false && (
        <View style={styles.centered}>
          <Text size="xsmall" color="boulder">
            nothing has been found :(
          </Text>
        </View>
      )}

      {hasResults && (
        <>
          <View>
            <FlatList
              data={users}
              renderItem={({item}) => (
                <UserHorizontalListItem item={{user: item}} />
              )}
              horizontal
              contentContainerStyle={styles.users}
            />
          </View>

          <StreamFeedView data={streams as any} />
        </>
      )}
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  users: {paddingHorizontal: 10, marginVertical: 10},
  streams: {
    flex: 1,
  },
});
