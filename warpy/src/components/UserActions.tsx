import {useModalNavigation} from '@app/hooks';
import {useStore, useStoreShallow} from '@app/store';
import React, {useCallback, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ButtonProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {Text} from './Text';
import {Icon} from './Icon';

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

  return {
    isFollowing,
    onToggleFollow,
    onOpenProfile,
  };
};

export const UserActions = (props: UserActionsProps) => {
  const {isFollowing, onToggleFollow} = useUserActionsController(props.id);

  return (
    <View style={styles.actions}>
      <UserAction title="report" icon="flag" color="#F97971" />
    </View>
  );
};

interface UserActionProps extends TouchableOpacityProps {
  icon: string;
  title: string;
  color: string;
}

const UserAction = (props: UserActionProps) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Icon name={props.icon} size={30} color={props.color} />
      <Text size="small" color="alert">
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
});
