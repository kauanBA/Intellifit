/*
   SERVIÇO DE RECEITAS

   Centraliza as requisições relacionadas às receitas
   utilizadas pela aplicação.

   Este serviço é responsável pela comunicação entre o
   frontend e os endpoints de receitas da API.

   Operações disponíveis:
   - Buscar sugestões de receitas com base nos alimentos
     disponíveis para o usuário.
   - Buscar os detalhes de uma receita específica.

   As requisições utilizam o token JWT armazenado no navegador
   para identificar o usuário autenticado.
*/

import API_URL from "./api";

/*
   ESTRUTURA DA RECEITA

   Define o formato dos dados de uma receita recebida pela API.

   Os campos principais armazenam informações como nome,
   imagem, instruções, categoria e origem da receita.

   matchingIngredients indica quantos ingredientes da receita
   correspondem aos alimentos disponíveis para o usuário.

   O índice [key: string] permite que a estrutura também aceite
   outros campos retornados pela API de receitas sem exigir que
   todos sejam declarados individualmente na interface.
*/

export interface Recipe {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strInstructions: string;
    strCategory: string;
    strArea: string;
    matchingIngredients: number;
    [key: string]: string | number | null;
}

/*
   BUSCAR SUGESTÕES DE RECEITAS

   Consulta a API para obter receitas sugeridas com base
   nos alimentos disponíveis para o usuário.

   O token JWT é enviado para que o backend identifique
   o usuário autenticado e utilize seus alimentos como
   base para gerar as sugestões.

   A API retorna as receitas acompanhadas da quantidade
   de ingredientes disponíveis que correspondem a cada
   receita.
*/

export async function getSuggestedRecipes(): Promise<Recipe[]> {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/api/recipes/suggestions`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.error ||
            "Erro ao buscar receitas."
        );
    }

    return result;
}

/*
   BUSCAR RECEITA POR ID

   Consulta a API para obter os detalhes de uma receita
   específica a partir do seu ID.

   O token JWT é enviado para autenticar a requisição.

   Em caso de sucesso, a função retorna os dados completos
   da receita, incluindo suas instruções, ingredientes e
   demais informações disponíveis.
*/

export async function getRecipeById(
    id: string
): Promise<Recipe> {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/api/recipes/${id}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.error ||
            "Erro ao buscar receita."
        );
    }

    return result;
}