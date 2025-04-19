

const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const swaggerui=require('swagger-ui-express');
const mongoose=require('mongoose');


const errorMiddleware=require('./src/api/middlewares/errorMiddleware');
const logger=require('./src/utils/logger');
const swaggerSpecs=require('./swagger');

// Load environment variables
dotenv.config();

// Import routes
const userRoutes=require('./src/api/routes/userRoutes');
const productRoutes=require('./src/api/routes/productRoutes');
const authRoutes = require('./src/api/routes/authRoutes');

const {seedProducts,seedUsers,seedTokens}=require('./src/data/seed');


// Initialize express app
const app=express();



//Middleware
app.use(cors({
    origin: '*', // Tüm domainlere izin ver (geliştirme için)
    // Veya belirli domainlere izin ver:
    // origin: ['https://yourfrontend.com', 'https://www.yourapp.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(async()=>{
        logger.info('MongoDB Atlas bağlantısı başarılı');
        console.log('MongoDB Atlas bağlantısı başarılı');
        await seedProducts();
        await seedUsers();
        await seedTokens();
    })
    .catch(err=>{
        logger.info('MongoDB Atlas connection error: ',err);
        console.log('MongoDB Atlas connection error: ',err);
    });


// Routes
console.log('Routes yükleniyor...');
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
console.log('Routes yüklendi');


// Swagger configuration use
app.use('/', swaggerui.serve, swaggerui.setup(swaggerSpecs));


// Error handling middleware
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger dokümantasyonu: http://localhost:${PORT}`);
});