

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


// // MIDDLEWARE
// // CORS middleware'ini daha detaylı yapılandırma
// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
//     credentials: true,
//     preflightContinue: false,
//     optionsSuccessStatus: 204
//   }));
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));







// CORS Preflight isteklerini ele almak için OPTIONS isteklerini işle
app.options('*', cors());

// CORS için manuel başlıklar ekle - en üst seviyede
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // OPTIONS isteklerini hemen yanıtla
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// CORS middleware'i
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// HTTPS yönlendirmesi (Render.com için)
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});

// JSON ve URL-encoded middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// CORS test endpoint'i
app.get('/api/cors-test', (req, res) => {
  res.json({ 
    message: 'CORS test successful', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    headers: req.headers
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});








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