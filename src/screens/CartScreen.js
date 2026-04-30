// screens/CartScreen.jsx
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services/cartService";

// ─── Substitua pelo id_cliente vindo do seu contexto/auth ───
const ID_CLIENTE_PLACEHOLDER = 1;

export default function CartScreen({ navigation, route }) {
  // Se você tiver contexto de autenticação, substitua a linha abaixo:
  const id_cliente = route?.params?.id_cliente ?? ID_CLIENTE_PLACEHOLDER;

  const [carrinho, setCarrinho] = useState(null);
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Recarrega sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [id_cliente])
  );

  const loadCart = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await fetchCart(id_cliente);
      setCarrinho(data.carrinho);
      setItens(data.itens);
    } catch (err) {
      Alert.alert("Erro", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdateQty = async (id_item, delta, qtdAtual) => {
    const novaQtd = qtdAtual + delta;
    if (novaQtd <= 0) {
      handleRemove(id_item);
      return;
    }
    try {
      await updateCartItem(id_item, novaQtd);
      setItens((prev) =>
        prev.map((i) =>
          i.id_item === id_item ? { ...i, quantidade: novaQtd } : i
        )
      );
      recalcTotal(id_item, novaQtd);
    } catch (err) {
      Alert.alert("Erro", err.message);
    }
  };

  const handleRemove = (id_item) => {
    Alert.alert("Remover item", "Deseja remover este produto do carrinho?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await removeCartItem(id_item);
            const novosItens = itens.filter((i) => i.id_item !== id_item);
            setItens(novosItens);
            const novoTotal = novosItens.reduce(
              (acc, i) => acc + i.quantidade * i.preco_unitario,
              0
            );
            setCarrinho((prev) => prev && { ...prev, valor_total: novoTotal });
          } catch (err) {
            Alert.alert("Erro", err.message);
          }
        },
      },
    ]);
  };

  const handleClear = () => {
    Alert.alert("Limpar carrinho", "Deseja remover todos os itens?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Limpar",
        style: "destructive",
        onPress: async () => {
          try {
            await clearCart(id_cliente);
            setItens([]);
            setCarrinho((prev) => prev && { ...prev, valor_total: 0 });
          } catch (err) {
            Alert.alert("Erro", err.message);
          }
        },
      },
    ]);
  };

  const recalcTotal = (id_item, novaQtd) => {
    setCarrinho((prev) => {
      if (!prev) return prev;
      const total = itens.reduce((acc, i) => {
        const qtd = i.id_item === id_item ? novaQtd : i.quantidade;
        return acc + qtd * i.preco_unitario;
      }, 0);
      return { ...prev, valor_total: total };
    });
  };

  // ── Renders ──────────────────────────────────────

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7B2D1E" />
      </View>
    );
  }

  if (!carrinho || itens.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Carrinho</Text>
        </View>
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
          <TouchableOpacity
            style={styles.btnShop}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnShopText}>Ver Produtos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.imagem_principal ? (
        <Image
          source={{ uri: item.imagem_principal }}
          style={styles.productImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>🍷</Text>
        </View>
      )}

      <View style={styles.cardInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.nome}
        </Text>
        <Text style={styles.productCategory}>{item.categoria}</Text>
        <Text style={styles.productPrice}>
          R$ {item.preco_unitario.toFixed(2)}
        </Text>

        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => handleUpdateQty(item.id_item, -1, item.quantidade)}
          >
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{item.quantidade}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => handleUpdateQty(item.id_item, +1, item.quantidade)}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => handleRemove(item.id_item)}
          >
            <Text style={styles.removeBtnText}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subtotal}>
        R$ {(item.quantidade * item.preco_unitario).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Carrinho</Text>
        <TouchableOpacity onPress={handleClear}>
          <Text style={styles.clearText}>Limpar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Itens */}
      <FlatList
        data={itens}
        keyExtractor={(item) => String(item.id_item)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadCart(true)}
            colors={["#7B2D1E"]}
          />
        }
      />

      {/* Footer com Total */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            R$ {(carrinho?.valor_total ?? 0).toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() =>
            navigation.navigate("Checkout", {
              id_compra: carrinho.id_compra,
              valor_total: carrinho.valor_total,
            })
          }
        >
          <Text style={styles.checkoutText}>Finalizar Pedido</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Estilos ──────────────────────────────────────────────────
const WINE = "#7B2D1E";
const WINE_LIGHT = "#F5EDE9";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF7F5" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE8E4",
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#1A0A06" },
  clearText: { fontSize: 14, color: WINE, fontWeight: "600" },

  // Empty state
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  emptyText: { fontSize: 16, color: "#999", marginBottom: 24 },
  btnShop: {
    backgroundColor: WINE,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnShopText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  // Lista
  list: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },

  // Card do produto
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 12,
    padding: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  productImage: {
    width: 68,
    height: 68,
    borderRadius: 10,
    backgroundColor: WINE_LIGHT,
  },
  imagePlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 10,
    backgroundColor: WINE_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: { fontSize: 28 },
  cardInfo: { flex: 1, marginLeft: 12 },
  productName: { fontSize: 14, fontWeight: "700", color: "#1A0A06" },
  productCategory: { fontSize: 11, color: "#999", marginTop: 2 },
  productPrice: { fontSize: 13, color: WINE, fontWeight: "600", marginTop: 4 },

  // Controle de quantidade
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: WINE_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: { fontSize: 18, color: WINE, fontWeight: "700", lineHeight: 22 },
  qtyValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A0A06",
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: "center",
  },
  removeBtn: { marginLeft: 16 },
  removeBtnText: { fontSize: 18 },

  // Subtotal
  subtotal: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1A0A06",
    marginLeft: 8,
    minWidth: 70,
    textAlign: "right",
  },

  // Footer
  footer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#EEE8E4",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  totalLabel: { fontSize: 17, color: "#555", fontWeight: "600" },
  totalValue: { fontSize: 22, fontWeight: "900", color: "#1A0A06" },
  checkoutBtn: {
    backgroundColor: WINE,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
    shadowColor: WINE,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "800", letterSpacing: 0.5 },
});