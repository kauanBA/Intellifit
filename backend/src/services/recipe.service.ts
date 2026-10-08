import { translateIngredient } from "../utils/ingredientMapper";

/*
   ESTRUTURA DAS RECEITAS

   MealSummary representa os dados básicos utilizados nas
   buscas e sugestões, contendo apenas identificação, nome
   e imagem da receita.

   MealDetails estende MealSummary com informações adicionais,
   como instruções de preparo, categoria e origem da receita.

   Essa separação permite utilizar apenas os dados necessários
   em cada etapa da aplicação, evitando buscas detalhadas quando
   elas não são necessárias.
*/

interface MealSummary {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
}

interface MealDetails extends MealSummary {
    strInstructions: string;
    strCategory: string;
    strArea: string;
    [key: string]: string | null;
}

/*
   SERVIÇO DE RECEITAS

   Responsável pela comunicação com a API externa TheMealDB
   para buscar receitas e seus respectivos detalhes.

   O serviço também utiliza o ingredientMapper para converter
   os nomes dos alimentos do sistema para os ingredientes
   esperados pela API externa.

   As operações deste serviço são utilizadas pelo
   RecipeController para gerar e consultar sugestões de receitas.
*/

export class RecipeService {

    private readonly baseUrl =
        "https://www.themealdb.com/api/json/v1/1";

/*
   BUSCAR RECEITAS POR INGREDIENTE

   Consulta a API TheMealDB para encontrar receitas que utilizam
   determinado ingrediente.

   Antes da consulta, o ingrediente recebido do sistema é
   convertido para o termo correspondente em inglês através
   do ingredientMapper.

   Caso o ingrediente não possua uma tradução conhecida,
   nenhuma receita é retornada.

   A resposta da API contém apenas um resumo das receitas,
   que posteriormente pode ser utilizado para buscar seus
   detalhes completos.
*/

    public async searchByIngredient(
        ingredient: string
    ): Promise<MealSummary[]> {

        const translatedIngredient =
            translateIngredient(ingredient);

        if (!translatedIngredient) {
            return [];
        }

        const response = await fetch(
            `${this.baseUrl}/filter.php?i=${encodeURIComponent(
                translatedIngredient
            )}`
        );

        if (!response.ok) {
            throw new Error(
                "Erro ao consultar a API de receitas."
            );
        }

        const data = await response.json();

        return data.meals ?? [];
    }

/*
   BUSCAR DETALHES DA RECEITA

   Consulta a API TheMealDB utilizando o ID da receita para
   obter suas informações completas.

   A resposta inclui dados adicionais, como instruções de
   preparo, categoria e origem da receita.

   Caso a API não encontre uma receita correspondente, o método
   retorna null para que o controller possa tratar essa situação.
*/

    public async getById(
        id: string
    ): Promise<MealDetails | null> {

        const response = await fetch(
            `${this.baseUrl}/lookup.php?i=${id}`
        );

        if (!response.ok) {
            throw new Error(
                "Erro ao buscar os detalhes da receita."
            );
        }

        const data = await response.json();

        return data.meals?.[0] ?? null;
    }
}