import { FoodRepository } from "../repositories/food.repository";
import { Food } from "../interfaces/food.interface";
import { CreateFood } from "../interfaces/create-food.interface";

export class FoodService {

    private foodRepository: FoodRepository;

    constructor() {
        this.foodRepository = new FoodRepository();
    }

    public async getAllFoods(userId: number): Promise<Food[]> {
        return await this.foodRepository.findAllByUserId(userId);
    }

    public async createFood(
        userId: number,
        food: CreateFood
    ): Promise<Food> {

        if (
            !food.name ||
            !food.category ||
            !food.unit ||
            !food.storageLocation
        ) {
            throw new Error(
                "Todos os campos obrigatórios devem ser preenchidos."
            );
        }

        if (food.quantity <= 0) {
            throw new Error(
                "A quantidade deve ser maior que zero."
            );
        }

        if (!food.expirationDate) {
            throw new Error(
                "A data de validade é obrigatória."
            );
        }

        return await this.foodRepository.create({
            userId,
            ...food
        });
    }

    public async getFoodById(
        id: number,
        userId: number
    ): Promise<Food> {

        const food = await this.foodRepository.findById(
            id,
            userId
        );

        if (!food) {
            throw new Error(
                "Alimento não encontrado."
            );
        }

        return food;
    }

    public async updateFood(
        id: number,
        userId: number,
        food: CreateFood
    ): Promise<Food> {

        if (
            !food.name ||
            !food.category ||
            !food.unit ||
            !food.storageLocation
        ) {
            throw new Error(
                "Todos os campos obrigatórios devem ser preenchidos."
            );
        }

        if (food.quantity <= 0) {
            throw new Error(
                "A quantidade deve ser maior que zero."
            );
        }

        if (!food.expirationDate) {
            throw new Error(
                "A data de validade é obrigatória."
            );
        }

        const updatedFood =
            await this.foodRepository.update(
                id,
                userId,
                food
            );

        if (!updatedFood) {
            throw new Error(
                "Alimento não encontrado."
            );
        }

        return updatedFood;
    }

    public async deleteFood(
        id: number,
        userId: number
    ): Promise<void> {

        const deleted =
            await this.foodRepository.delete(
                id,
                userId
            );

        if (!deleted) {
            throw new Error(
                "Alimento não encontrado."
            );
        }
    }

    public async getExpiringFoods(
        userId: number
    ): Promise<any[]> {

        const foods =
            await this.foodRepository.findExpiringByUserId(
                userId
            );

        return foods.map((food) => {

            const today = new Date();
            const expiration =
                new Date(food.expirationDate);

            today.setHours(0, 0, 0, 0);
            expiration.setHours(0, 0, 0, 0);

            const differenceInMilliseconds =
                expiration.getTime() -
                today.getTime();

            const daysUntilExpiration =
                Math.ceil(
                    differenceInMilliseconds /
                    (1000 * 60 * 60 * 24)
                );

            let status: string;

            if (daysUntilExpiration < 0) {
                status = "EXPIRED";
            } else if (daysUntilExpiration === 0) {
                status = "TODAY";
            } else {
                status = "ATTENTION";
            }

            return {
                ...food,
                daysUntilExpiration,
                status
            };
        });
    }
}