
import { apiLimiter } from './middlewares/rateLimit.js';
import utxoRoutes from './routes/utxoRoutes.js'
import express from 'express'
import morgan from 'morgan';
import transactionRoute from './routes/transanctionRoute.js'
import cors from 'cors'

const app = express();
app.use(cors());

app.use(express.json());

app.use(morgan('dev'));


app.use('/api/',apiLimiter);
app.use('/api',utxoRoutes);
app.use('/api',transactionRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ 🏁 Server running on port ${PORT}`));
