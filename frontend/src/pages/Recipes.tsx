import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getSuggestedRecipes,
    type Recipe
} from "../services/recipeService";

function Recipes() {

    const navigate = useNavigate();

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        async function loadRecipes() {

            try {

                const suggestedRecipes =
                    await getSuggestedRecipes();

                setRecipes(suggestedRecipes);

            } catch (error) {

                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError(
                        "Erro ao carregar receitas."
                    );
                }

            } finally {

                setLoading(false);

            }
        }

        loadRecipes();

    }, []);

    return (
        <div className="page-container">

            <div className="page-header">

                <div>
                    <h1>Receitas</h1>

                    <p className="page-description">
                        Encontre receitas com base nos
                        alimentos disponíveis na sua casa.
                    </p>
                </div>

            </div>

            {loading && (
                <p>
                    Buscando receitas...
                </p>
            )}

            {error && (
                <p className="form-error">
                    {error}
                </p>
            )}

            {!loading &&
                !error &&
                recipes.length === 0 && (
                    <div className="empty-state">

                        <h2>
                            Nenhuma receita encontrada
                        </h2>

                        <p>
                            Cadastre mais alimentos para
                            receber sugestões de receitas.
                        </p>

                    </div>
                )}

            {!loading &&
                !error &&
                recipes.length > 0 && (

                    <div className="recipe-grid">

                        {recipes.map((recipe) => (

                            <div
                                className="recipe-card"
                                key={recipe.idMeal}
                            >

                                <img
                                    src={recipe.strMealThumb}
                                    alt={recipe.strMeal}
                                    className="recipe-image"
                                />

                                <div className="recipe-content">

                                    <h2>
                                        {recipe.strMeal}
                                    </h2>

                                    <p>
                                        {recipe.strCategory}
                                    </p>

                                    <p>
                                        Você possui{" "}
                                        <strong>
                                            {recipe.matchingIngredients}
                                        </strong>{" "}
                                        ingrediente(s)
                                        desta receita.
                                    </p>

                                    <button
                                        className="button-primary"
                                        onClick={() =>
                                            navigate(`/recipes/${recipe.idMeal}`)
                                        }
                                    >
                                        Ver receita
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

        </div>
    );
}

export default Recipes;