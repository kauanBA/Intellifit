import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getRecipeById,
    type Recipe
} from "../services/recipeService";

function RecipeDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] =
        useState<Recipe | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        async function loadRecipe() {

            if (!id) {
                setError(
                    "ID da receita não informado."
                );
                setLoading(false);
                return;
            }

            try {

                const result =
                    await getRecipeById(id);

                setRecipe(result);

            } catch (error) {

                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError(
                        "Erro ao carregar receita."
                    );
                }

            } finally {

                setLoading(false);

            }
        }

        loadRecipe();

    }, [id]);

    if (loading) {
        return (
            <div className="page-container">

                <p>
                    Carregando receita...
                </p>

            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">

                <p className="form-error">
                    {error}
                </p>

                <button
                    className="button-secondary"
                    onClick={() => navigate("/recipes")}
                >
                    Voltar para receitas
                </button>

            </div>
        );
    }

    if (!recipe) {
        return null;
    }

    return (
        <div className="page-container">

            <button
                className="button-secondary"
                onClick={() => navigate("/recipes")}
            >
                ← Voltar para receitas
            </button>

            <div className="recipe-details">

                <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="recipe-details-image"
                />

                <div className="recipe-details-content">

                    <h1>
                        {recipe.strMeal}
                    </h1>

                    <p>
                        <strong>Categoria:</strong>{" "}
                        {recipe.strCategory}
                    </p>

                    <p>
                        <strong>Origem:</strong>{" "}
                        {recipe.strArea}
                    </p>

                    <h2>
                        Modo de preparo
                    </h2>

                    <p>
                        {recipe.strInstructions}
                    </p>

                </div>

            </div>

        </div>
    );
}

export default RecipeDetails;