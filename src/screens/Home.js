import { useSQLiteContext } from "expo-sqlite";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import WineCard from "../components/WineCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const database = useSQLiteContext();

  const getProducts = async () => {
    try {
      const query = `
        SELECT p.*, 
        (SELECT url FROM produto_imagens WHERE id_produto = p.id_produto LIMIT 1) as url_imagem 
        FROM produtos p
      `;
      const result = await database.getAllAsync(query);
      setProducts(result || []);
    } catch (error) {
      console.error("Erro ao buscar produtos na Home:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getProducts();
    }, [])
  );

  const firstRow = products.slice(0, 4);
  const secondRow = products.slice(4, 8);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Image
            source={require("../../assets/imagemPrincipalHome.png")}
            style={styles.wineImage}
          />
          <Text style={styles.title}>Novos Lançamentos</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardList}
            style={{ marginBottom: 20 }}
          >
            {firstRow.map((product) => {
              return <WineCard key={product.id_produto} idCliente={1} produto={product} />;
            })}
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardList}
          >
            {secondRow.map((product) => (
              <WineCard key={product.id_produto} idCliente={1} produto={product} />
            ))}
          </ScrollView>
          <Image
            source={require("../../assets/segundaImagemHome.png")}
            style={styles.wineImage2}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#E8E0CC",
  },
  title: {
    fontSize: 28,
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 15,
    fontWeight: "300",
  },
  cardList: {
    paddingHorizontal: 20,
  },
  wineImage2: {
    marginBottom: 80,
  },
  wineImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  }
});