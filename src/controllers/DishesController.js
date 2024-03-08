const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");

class DishesController {
    async create(request, response) {
        try {
            const { title, description, price, category, ingredients } = request.body;
            const user_id = request.user.id;
            const image = request.file.filename;

            const diskStorage = new DiskStorage();
            const filename = await diskStorage.saveFile(image);

            const ingredientsArray = JSON.parse(ingredients || '[]');

            const [ dishes_id ] = await knex("dishes").insert({
                image: filename,
                title,
                description,
                price,
                category,
                user_id
            });
            
            const ingredientsInsert = ingredientsArray.map(name => {
              return {
                dishes_id,
                name,
                user_id
              }
            })

            await knex("ingredients").insert(ingredientsInsert)

            return response.json({ message: "Prato criado com sucesso" });
        } catch (error) {
            console.error("Erro ao criar prato:", error);
            return response.status(500).json({
                status: "error",
                message: "Erro interno no servidor",
            });
        }
    }
      
    async update(request, response) {
        try {
          const { id } = request.params;
          const { title, description, price, category, ingredients } = request.body;
          const imageFilename = request.file?.filename;
      
          const dish = await knex("dishes").where({ id }).first();
      
          if (!dish) {
            throw new AppError("Prato não encontrado.", 404);
          }
      
          const dishUpdate = {
            title: title ?? dish.title,
            description: description ?? dish.description,
            category: category ?? dish.category,
            price: price ?? dish.price,
            updated_at: knex.fn.now(),
          };
      
          if (imageFilename) {
            const diskStorage = new DiskStorage();
      
            if (dish.image) {
              await diskStorage.deleteFile(dish.image);
            }
      
            const filename = await diskStorage.saveFile(imageFilename);
            dishUpdate.image = filename;
          }
      
          if (ingredients) {
            await knex("ingredients").where({ dishes_id: id }).delete();
      
            const ingredientsArray = JSON.parse(ingredients || '[]');
            const ingredientsInsert = ingredientsArray.map((name) => {
              return {
                dishes_id: id,
                name,
                user_id: request.user.id,
              };
            });
      
            await knex("ingredients").insert(ingredientsInsert);
          }
      
          await knex("dishes").where({ id }).update(dishUpdate);
      
          return response.json({ message: "Prato atualizado com sucesso" });
        } catch (error) {
          console.error("Erro ao atualizar prato:", error);
          return response.status(500).json({
            status: "error",
            message: "Erro interno no servidor",
          });
        }
    }

    async show(request, response) {
        const { id } = request.params;

        const dishe = await knex("dishes").where({ id }).first();
        const ingredients = await knex("ingredients").where({ dishes_id: id }).orderBy("name");

        return response.json({
            ...dishe,
            ingredients
        });
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("dishes").where({ id }).delete();

        return response.json();
    }

    async index(request, response) {
      const { title, ingredients } = request.query;
    
      let dishes;
    
      if (ingredients) {
        const filterIngredients = ingredients
          .split(",")
          .map((ingredients) => ingredients.trim());
    
        dishes = await knex("ingredients")
          .select([
            "dishes.id",
            "dishes.title",
            "dishes.user_id",
            "dishes.category",
            "dishes.price",
            "dishes.description",
            "dishes.image",
          ])
          .whereLike("dishes.title", `%${title}%`)
          .whereIn("ingredients.name", filterIngredients)
          .innerJoin("dishes", "dishes.id", "ingredients.dishes_id");
      } else {
        dishes = await knex("dishes")
          .whereLike("title", `%${title}%`)
          .orderBy("title");
      }
    
      const userIngredients = await knex("ingredients");
      const dishesWithIngredients = dishes.map((dishe) => {
        const dishesIngredients = userIngredients.filter(
          (ingredient) => ingredient.dishes_id === dishe.id
        );
        return {
          ...dishe,
          ingredients: dishesIngredients,
        };
      });
    
      return response.json(dishesWithIngredients);
    }
    

    

}
module.exports = DishesController;