import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import WineCard from '../components/WineCard';
import BottomNav from '../components/BottomNav';

export default function WineBox() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.bannerPlaceholder}>
          <Text style={styles.bannerText}>Banner</Text>
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>WineBox</Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.carouselContainer}
        >
          <WineCard title="Cabernet Sauvignon Watchful Eye" year="2021" price="110,29" />
          <WineCard title="Cabernet Sauvignon Watchful Eye" year="2021" price="110,29" />
          <WineCard title="Cabernet Sauvignon Watchful Eye" year="2021" price="110,29" />
          <WineCard title="Cabernet Sauvignon Watchful Eye" year="2021" price="110,29" />
        </ScrollView>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.carouselContainer}
        >
          <WineCard title="Cabernet Sauvignon Watchful Eye" year="2021" price="110,29" />
          <WineCard title="Cabernet Sauvignon Watchful Eye" year="2021" price="110,29" />
          <WineCard title="Cabernet Sauvignon Watchful Eye" year="2021" price="110,29" />
          <WineCard title="Cabernet Sauvignon Watchful Eye" year="2021" price="110,29" />
        </ScrollView>

        <View style={{ height: 100 }} /> 
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E6',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bannerPlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#4A0E17',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    color: '#555',
    fontStyle: 'italic',
  },
  headerRow: { 
    alignItems: 'center',
    paddingVertical: 15,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#333',
  },
  carouselContainer: {
    paddingLeft: 20, 
    paddingRight: 5, 
    paddingBottom: 25, 
  }
});