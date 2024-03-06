const { Router } = require('express');
const multer = require("multer")
const uploadConfig = require("../configs/upload");

const DishesController = require('../controllers/DishesController');
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const dishesRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const dishesController = new DishesController();

dishesRoutes.use(ensureAuthenticated);

dishesRoutes.get('/', dishesController.index);
dishesRoutes.post('/', upload.single("image"), dishesController.create);
dishesRoutes.patch("/:id", upload.single("image"), dishesController.update);
dishesRoutes.get('/:id', dishesController.show);
dishesRoutes.delete('/:id', dishesController.delete);

// dishesRoutes.patch("/:id", upload.single("image"), (req, res) => {
//     console.log(req.file.filename);
//     response.json();
// });

// dishesRou tes.post("/", upload.single("image"), dishesController.create);

// dishesRoutes.post("/image", upload.single("image"), (req, res) => {
//     console.log(req.file);

//     return res.json({ hello: "Rocket" });
// });

// dishesRoutes.patch("/image", upload.single("image"), dishImageController.update);
// dishesRoutes.put("/:id", upload.single("image"), dishesController.update);

module.exports = dishesRoutes;















// function myMiddleware(request, response, next) {
//     if(!request.body.isAdmin){
//         return response.json({ message: "user unauthorized" });
//     }

//     next();
// }

// usersRoutes.post('/', myMiddleware, usersController.create)