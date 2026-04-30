// services/cartService.js
import { api } from "./api"; // usa sua variável de ambiente já existente

// ─────────────────────────────────────────
// Busca o carrinho ativo do cliente
// ─────────────────────────────────────────
export const fetchCart = async (id_cliente) => {
  const response = await fetch(`${api}/cart/${id_cliente}`);
  if (!response.ok) throw new Error("Erro ao buscar carrinho.");
  return response.json(); // { carrinho, itens[] }
};

// ─────────────────────────────────────────
// Adiciona produto ao carrinho
// ─────────────────────────────────────────
export const addToCart = async (id_cliente, id_produto, quantidade = 1) => {
  const response = await fetch(`${api}/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_cliente, id_produto, quantidade }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.erro || "Erro ao adicionar ao carrinho.");
  return data;
};

// ─────────────────────────────────────────
// Atualiza a quantidade de um item
// ─────────────────────────────────────────
export const updateCartItem = async (id_item, quantidade) => {
  const response = await fetch(`${api}/cart/item/${id_item}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantidade }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.erro || "Erro ao atualizar item.");
  return data;
};

// ─────────────────────────────────────────
// Remove um item do carrinho
// ─────────────────────────────────────────
export const removeCartItem = async (id_item) => {
  const response = await fetch(`${api}/cart/item/${id_item}`, {
    method: "DELETE",
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.erro || "Erro ao remover item.");
  return data;
};

// ─────────────────────────────────────────
// Limpa o carrinho inteiro
// ─────────────────────────────────────────
export const clearCart = async (id_cliente) => {
  const response = await fetch(`${api}/cart/${id_cliente}`, {
    method: "DELETE",
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.erro || "Erro ao limpar carrinho.");
  return data;
};