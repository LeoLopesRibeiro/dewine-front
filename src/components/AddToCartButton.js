// components/AddToCartButton.jsx
// Uso: <AddToCartButton idCliente={1} idProduto={3} />

import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from "react-native";
import { addToCart } from "../services/cartService";

export default function AddToCartButton({
  idCliente,
  idProduto,
  quantidade = 1,
  onSuccess,
  onError,
  style,
}) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const scale = new Animated.Value(1);

  const handlePress = async () => {
    if (loading || added) return;

    // Micro-animação de pressionar
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.93, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();

    setLoading(true);
    try {
      await addToCart(idCliente, idProduto, quantidade);
      setAdded(true);
      onSuccess?.();
      // Reseta o estado após 2s para permitir adicionar novamente
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      onError?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          added && styles.buttonAdded,
          loading && styles.buttonLoading,
          style,
        ]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.text}>
            {added ? "✓ Adicionado!" : "Adicionar ao Carrinho"}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#7B2D1E",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 200,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonAdded: {
    backgroundColor: "#2E7D32",
  },
  buttonLoading: {
    backgroundColor: "#9E4033",
  },
  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});