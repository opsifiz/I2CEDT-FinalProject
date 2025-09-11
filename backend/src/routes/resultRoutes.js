import express from "express";

import * as resultController from "../controllers/resultController.js";

const router = express.Router();

router.get('/', resultController.createResult);
router.post('/', resultController.createResult);
router.post('/:update', resultController.updateResult);
router.post('/:filter', resultController.filterResult);
router.delete('/:id', resultController.deleteResult);

export default router;