import { useEffect, useState } from "react";
import { getFoods, deleteFood, type Food } from "../services/foodService";
import { useNavigate } from "react-router-dom";

function Foods() {

    const [foods, setFoods] = useState<Food[]>([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleDelete(id: number) {

        const confirmed = window.confirm(
            "Tem certeza que deseja excluir este alimento?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteFood(id);

            setFoods((previous) =>
                previous.filter(
                    (food) => food.id !== id
                )
            );

        } catch (error) {

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(
                    "Erro ao excluir alimento."
                );
            }
        }
    }

    useEffect(() => {

        async function loadFoods() {

            try {

                const result = await getFoods();

                setFoods(result);

            } catch (error) {

                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError(
                        "Erro ao carregar alimentos."
                    );
                }
            }
        }

        loadFoods();

    }, []);

    function getExpirationStatus(
        expirationDate: string
    ) {

        const today = new Date();
        const expiration = new Date(expirationDate);

        today.setHours(0, 0, 0, 0);
        expiration.setHours(0, 0, 0, 0);

        const difference =
            expiration.getTime() -
            today.getTime();

        const days =
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            );

        if (days < 0) {
            return {
                className: "expired",
                text: "Vencido"
            };
        }

        if (days === 0) {
            return {
                className: "today",
                text: "Vence hoje"
            };
        }

        if (days <= 7) {
            return {
                className: "attention",
                text: `Vence em ${days} dias`
            };
        }

        return {
            className: "normal",
            text: `Vence em ${days} dias`
        };
    }

    return (
        <div className="page-container">

            <div className="page-header">

                <h1>Meus alimentos</h1>


                <button
                    onClick={() => navigate("/foods/new")}
                >
                    Adicionar alimento
                </button>


            </div>

            <p className="page-description">
                Gerencie os alimentos da sua despensa,
                geladeira e freezer.
            </p>

            <span className="food-count">
                {foods.length}{" "}
                {foods.length === 1
                    ? "alimento cadastrado"
                    : "alimentos cadastrados"}
            </span>

            {error && (
                <p>{error}</p>
            )}

            {foods.length === 0 && !error && (
                <div className="empty-state">

                    <h2>
                        Sua despensa está vazia
                    </h2>

                    <p>
                        Comece cadastrando seu primeiro alimento
                        para organizar sua despensa.
                    </p>

                    <button
                        onClick={() => navigate("/foods/new")}
                    >
                        + Adicionar alimento
                    </button>

                </div>
            )}

            <ul className="food-list">

                {foods.map((food) => (

                    <li
                        key={food.id}
                        className="food-card"
                    >

                        <div className="food-info">

                            <span className="food-name">
                                {food.name}
                            </span>

                            <span className="food-details">
                                {food.category}
                                {" • "}
                                {food.quantity} {food.unit}
                                {" • "}
                                {food.storageLocation}
                            </span>

                            <span
                                className={`food-expiration ${getExpirationStatus(
                                    food.expirationDate
                                ).className
                                    }`}
                            >
                                {getExpirationStatus(
                                    food.expirationDate
                                ).text}
                            </span>

                        </div>

                        <div className="food-actions">

                            <button
                                className="button-secondary"
                                onClick={() =>
                                    navigate(
                                        `/foods/${food.id}/edit`
                                    )
                                }
                            >
                                Editar
                            </button>

                            <button
                                className="button-danger"
                                onClick={() =>
                                    handleDelete(food.id)
                                }
                            >
                                Excluir
                            </button>

                        </div>

                    </li>

                ))}

            </ul>

        </div>
    );

}

export default Foods;