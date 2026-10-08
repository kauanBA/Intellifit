import { Response, NextFunction } from "express";
import { RecipeService } from "../services/recipe.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { FoodRepository } from "../repositories/food.repository";

/*
   CONTROLLER DE RECEITAS

   Responsável por receber as requisições relacionadas às
   receitas e coordenar a comunicação entre os dados do
   usuário e o RecipeService.

   O controller utiliza o FoodRepository para obter os alimentos
   do usuário e o RecipeService para consultar as receitas.

   Também organiza as sugestões de receitas de acordo com a
   quantidade de ingredientes disponíveis para o usuário.
*/

export class RecipeController {

    private recipeService: RecipeService;
    private foodRepository: FoodRepository;

    constructor() {
        this.recipeService = new RecipeService();
        this.foodRepository = new FoodRepository();
    }

/*
   GERAR SUGESTÕES DE RECEITAS

   Obtém os alimentos do usuário autenticado e utiliza cada
   alimento como ingrediente para buscar receitas compatíveis.

   As receitas encontradas são agrupadas pelo ID e recebem
   uma contagem de quantos ingredientes disponíveis pelo
   usuário correspondem a cada receita.

   Após a classificação, as seis receitas com maior número
   de ingredientes correspondentes são selecionadas e seus
   detalhes completos são consultados antes de serem enviados
   ao frontend.
*/

    public getSuggestedRecipes = async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {

        try {

            if (!req.userId) {
                throw new Error(
                    "Usuário não autenticado."
                );
            }

            const foods =
                await this.foodRepository.findAllByUserId(
                    req.userId
                );

/*
   AGRUPAMENTO DAS RECEITAS

   Utiliza um Map para agrupar as receitas encontradas pelo
   ID da receita e evitar duplicações.

   Quando uma receita aparece novamente a partir de outro
   alimento do usuário, seu contador de matchingIngredients
   é incrementado.

   Dessa forma, quanto mais ingredientes disponíveis o usuário
   possuir para uma determinada receita, maior será sua
   prioridade nas sugestões.
*/

            const recipesMap = new Map<
                string,
                {
                    idMeal: string;
                    strMeal: string;
                    strMealThumb: string;
                    matchingIngredients: number;
                }
            >();

            for (const food of foods) {

                const recipes =
                    await this.recipeService.searchByIngredient(
                        food.name
                    );

                for (const recipe of recipes) {

                    const existing =
                        recipesMap.get(recipe.idMeal);

                    if (existing) {

                        existing.matchingIngredients += 1;

                    } else {

                        recipesMap.set(
                            recipe.idMeal,
                            {
                                ...recipe,
                                matchingIngredients: 1
                            }
                        );
                    }
                }
            }

/*
   CLASSIFICAÇÃO DAS SUGESTÕES

   Converte as receitas agrupadas no Map para um array e
   ordena os resultados pela quantidade de ingredientes
   correspondentes.

   As receitas com mais ingredientes disponíveis pelo usuário
   aparecem primeiro.

   Em seguida, apenas as seis primeiras receitas são
   selecionadas para serem exibidas no sistema.
*/

            const recipes =
                Array.from(recipesMap.values())
                    .sort(
                        (a, b) =>
                            b.matchingIngredients -
                            a.matchingIngredients
                    );

            const topRecipes = recipes.slice(0, 6);

/*
   OBTENÇÃO DOS DETALHES

   Após selecionar as seis receitas mais relevantes, consulta
   o RecipeService para obter os detalhes completos de cada uma.

   As requisições são realizadas em paralelo com Promise.all(),
   permitindo buscar várias receitas simultaneamente.

   A quantidade de ingredientes correspondentes é preservada
   junto aos detalhes para que o frontend possa utilizar essa
   informação ao exibir as sugestões.
*/
            const detailedRecipes = await Promise.all(
                topRecipes.map(async (recipe) => {

                    const details =
                        await this.recipeService.getById(
                            recipe.idMeal
                        );

                    if (!details) {
                        return null;
                    }

                    return {
                        ...details,
                        matchingIngredients:
                            recipe.matchingIngredients
                    };
                })
            );

            res.json(
                detailedRecipes.filter(
                    (recipe) => recipe !== null
                )
            );

        } catch (error) {

            next(error);

        }
    };

/*
   BUSCAR RECEITA POR ID

   Consulta os detalhes de uma receita específica utilizando
   o ID recebido nos parâmetros da requisição.

   Antes da consulta, verifica se existe um usuário autenticado
   e se o ID informado possui um formato válido.

   Caso a receita seja encontrada, seus dados são retornados
   ao frontend. Se não existir, a API retorna um erro 404.
*/

    public getRecipeById = async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {

        try {

            if (!req.userId) {
                throw new Error(
                    "Usuário não autenticado."
                );
            }

            const { id } = req.params;

            if (typeof id !== "string") {
                res.status(400).json({
                    error: "ID da receita inválido."
                });
                return;
            }

            const recipe =
                await this.recipeService.getById(id);

            if (!recipe) {
                res.status(404).json({
                    error: "Receita não encontrada."
                });
                return;
            }

            res.json(recipe);

        } catch (error) {

            next(error);

        }
    };
}