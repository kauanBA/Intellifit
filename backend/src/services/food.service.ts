
import { FoodRepository } from "../repositories/food.repository";
import { Food } from "../interfaces/food.interface";
import { CreateFood } from "../interfaces/create-food.interface";

/*
   SERVIÇO DE ALIMENTOS

   Centraliza as regras de negócio relacionadas aos alimentos.

   A FoodService recebe as solicitações das rotas e utiliza o
   FoodRepository para acessar os dados no banco de dados.

   Além de realizar as operações de cadastro, consulta,
   atualização e exclusão, este serviço também valida os dados
   recebidos e calcula o status de validade dos alimentos.

   As operações utilizam o userId para garantir que os dados
   sejam relacionados ao usuário autenticado.
*/

export class FoodService {

    private foodRepository: FoodRepository;

    constructor() {
        this.foodRepository = new FoodRepository();
    }

    public async getAllFoods(userId: number): Promise<Food[]> {
        return await this.foodRepository.findAllByUserId(userId);
    }

/*
   CADASTRO E VALIDAÇÃO

   Valida os dados do alimento antes de enviá-los ao banco
   de dados.

   São verificados:
   - Preenchimento dos campos obrigatórios.
   - Quantidade maior que zero.
   - Existência da data de validade.

   Após todas as validações, o userId é associado ao alimento
   e os dados são enviados ao FoodRepository para persistência.
*/

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

/*
   BUSCAR ALIMENTO POR ID

   Consulta um alimento específico utilizando seu ID e o
   userId do usuário autenticado.

   O userId é utilizado junto ao ID para garantir que o alimento
   pertence ao usuário que realizou a requisição.

   Caso o alimento não seja encontrado ou não pertença ao
   usuário, a operação retorna um erro.
*/

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

/*
   ATUALIZAÇÃO E VALIDAÇÃO

   Valida os novos dados do alimento antes de realizar
   a atualização no banco de dados.

   São verificadas as mesmas regras utilizadas no cadastro,
   como preenchimento dos campos obrigatórios, quantidade
   maior que zero e existência da data de validade.

   O ID e o userId são utilizados para garantir que somente
   um alimento pertencente ao usuário autenticado seja
   atualizado.

   Caso o alimento não seja encontrado, a atualização é
   interrompida e um erro é retornado.
*/

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

/*
   EXCLUSÃO DE ALIMENTO

   Remove um alimento do banco de dados utilizando seu ID
   e o userId do usuário autenticado.

   O userId garante que a operação seja realizada somente
   sobre alimentos pertencentes ao usuário.

   Caso nenhum alimento seja encontrado para os dados
   informados, a exclusão é interrompida e um erro é retornado.
*/

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

/*
   CONTROLE DE VALIDADE

   Busca os alimentos do usuário e calcula quantos dias faltam
   para a data de vencimento de cada um.

   A partir dessa diferença, cada alimento recebe um status:

   - EXPIRED: alimento já está vencido.
   - TODAY: alimento vence no dia atual.
   - ATTENTION: alimento ainda não venceu, mas deve ser
     acompanhado pelo usuário.

   As informações calculadas são adicionadas aos dados originais
   e retornadas para o frontend, permitindo a exibição de
   alertas e indicadores de validade no sistema.
*/

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