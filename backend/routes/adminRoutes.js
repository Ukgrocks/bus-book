import express from 'express';
import { addBus, updateBus, deleteBus, adminLogin, getBuses, fetchBus, bookTicket, allbuses, alltickets, cancelticket, fetchticket } from '../controllers/adminControllers.js';
const router = express.Router();

router.post('/bus', addBus); // Admin adds a bus
router.put('/bus/:id', updateBus); // Admin updates bus details
router.delete('/bus/:id', deleteBus); // Admin deletes a bus
router.get('/bus/:id', fetchBus); // Admin deletes a bus
router.post('/bus/find',getBuses);
router.get('/allbuses',allbuses);
router.get('/alltickets',alltickets);
router.post('/oneticket',fetchticket);
router.post('/cancelticket',cancelticket);
router.post('/login',adminLogin);
router.post('/ticket',bookTicket);

export default router;
