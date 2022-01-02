import {useModalNavigation} from '@app/hooks';
import {useStore, useStoreShallow} from '@app/store';
import React, {useCallback, useMemo} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {Text} from './Text';
import {Icon} from './Icon';
import {colors, Colors} from '../../colors';

interface UserActionsProps {
  id: string;
}

export const useUserActionsController = (id: string) => {
  const navigation = useModalNavigation();
  const [following] = useStoreShallow(state => [state.following]);

  const onOpenProfile = useCallback(() => {
    useStore.getState().dispatchModalClose();
    navigation.navigate('User', {id});
  }, [id]);

  const isFollowing = useMemo(() => following.includes(id), [following, id]);

  const onToggleFollow = useCallback(async () => {
    if (isFollowing) {
      useStore.getState().dispatchFollowingRemove(id);
    } else {
      useStore.getState().dispatchFollowingAdd(id);
    }
  }, [id, isFollowing]);

  const onReport = useCallback(() => {
    useStore.getState().dispatchModalOpen('reports');
  }, []);

  const onBlock = useCallback(() => {
    throw new Error('Not implemented yet');
  }, []);

  const onChat = useCallback(() => {
    throw new Error('Not implemented yet');
  }, []);

  return {
    isFollowing,
    onToggleFollow,
    onOpenProfile,
    onReport,
    onBlock,
    onChat,
  };
};

export const UserActions = (props: UserActionsProps) => {
  const {isFollowing, onChat, onToggleFollow, onReport, onBlock} =
    useUserActionsController(props.id);

  return (
    <View style={styles.actions}>
      <View style={[styles.row, styles.rowSpace]}>
        <UserAction
          onPress={onToggleFollow}
          title={isFollowing ? 'unfollow' : 'follow'}
          icon={isFollowing ? 'account-minus' : 'account-plus'}
          color="blue"
        />
        <UserAction onPress={onReport} title="report" icon="flag" color="red" />
      </View>
      <View style={styles.row}>
        <UserAction onPress={onChat} title="chat" icon="chat" color="yellow" />
        <UserAction
          onPress={onBlock}
          title="block"
          icon="block"
          color="orange"
        />
      </View>
    </View>
  );
};

interface UserActionProps extends TouchableOpacityProps {
  icon: string;
  title: string;
  color: Colors;
}

const UserAction = (props: UserActionProps) => {
  return (
    <TouchableOpacity style={styles.action} onPress={props.onPress}>
      <Icon name={props.icon} size={40} color={colors[props.color]} />
      <Text
        style={styles.title}
        size="small"
        weight="extraBold"
        color={props.color}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actions: {
    marginTop: 30,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#181818',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowSpace: {
    marginBottom: 20,
  },
});
