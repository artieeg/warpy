import React from 'react';
import {Avatar} from './Avatar';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from './Text';
import {Participant} from '@warpy/lib';
import {Checkbox} from './Checkbox';

interface IHostCandidate {
  data: Participant;
  selected: boolean;
  onPress: (id: string) => any;
}

export const HostCandidate: React.FC<IHostCandidate> = props => {
  const {data, selected, onPress} = props;
  const {id, role} = data;
  const name = `${data.first_name}`;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(id)}
      style={styles.wrapper}>
      <View style={styles.dataContainer}>
        <Avatar user={data} />
        <View style={styles.text}>
          <Text weight="bold" size="small">
            {name}
          </Text>

          <Text weight="bold" color="boulder" size="small">
            {role}
          </Text>
        </View>
      </View>
      <Checkbox visible={selected} onToggle={() => onPress(id)} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dataContainer: {
    flexDirection: 'row',
  },
  text: {
    marginLeft: 10,
  },
  producerAction: {
    width: 35,
    height: 35,
    marginBottom: 5,
    borderRadius: 20,
    marginRight: 10,
  },
  producerActionEnabled: {
    backgroundColor: '#F9F871',
  },
});
