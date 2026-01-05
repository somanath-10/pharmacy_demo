const express = require('express');
import { checkAvailability, postMedicine,restockMedicine} from '../controllers/Medicine';

const router = express.Router();

router.post('/check-availability', checkAvailability);
router.post('/insert-medicine', postMedicine);
router.post('/restock-medicine', restockMedicine);
export default router;