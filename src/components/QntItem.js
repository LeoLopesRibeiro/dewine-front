import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import IconAdd from '../../assets/icons/adicionar.png';
import IconRemove from '../../assets/icons/remover.png';

export default function QntItem({ quantity, onIncrease, onDecrease }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onDecrease} style={styles.button}>
        <Image source={IconRemove} style={styles.icon} />
      </TouchableOpacity>
      
      <Text style={styles.quantityText}>{quantity < 10 ? `0${quantity}` : quantity}</Text>
      
      <TouchableOpacity onPress={onIncrease} style={styles.button}>
        <Image source={IconAdd} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF7F0',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0D6C1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    width: 80,
    justifyContent: 'space-between',
  },
  button: { padding: 4 },
  icon: { width: 10, height: 10, resizeMode: 'contain' },
  quantityText: { fontSize: 12, fontWeight: 'bold', color: '#333' },
});