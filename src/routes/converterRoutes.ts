import express from 'express';
import ConverterController from '../controllers/converterController';

const router = express.Router();
const converterController = new ConverterController();

router.post('/', converterController.convertTypeScriptToDart);

export default router;
