const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { User, Movie, Theater, Session } = require('../models'); // Verifique se o caminho está correto
const connectDB = require('../config/db'); // Verifique se o caminho está correto

dotenv.config();

// --- DADOS DE BASE QUE QUEREMOS GARANTIR QUE EXISTAM ---

const usersData = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user'
  }
];

const moviesData = [
  {
    customId: '1',
    title: 'Inception',
    synopsis: 'A thief who enters the dreams of others to steal their secrets.',
    director: 'Christopher Nolan',
    genres: ['Science Fiction', 'Action'],
    duration: 148,
    classification: 'PG-13',
    poster: 'inception.jpg',
    releaseDate: new Date('2010-07-16')
  },
  {
    customId: '2',
    title: 'The Avengers',
    synopsis: "Earth's mightiest heroes must come together to save the world.",
    director: 'Joss Whedon',
    genres: ['Action', 'Adventure'],
    duration: 143,
    classification: 'PG-13',
    poster: 'avengers.jpg',
    releaseDate: new Date('2012-05-04')
  },
  {
    customId: '3',
    title: 'The Shawshank Redemption',
    synopsis: 'Two imprisoned men bond over a number of years.',
    director: 'Frank Darabont',
    genres: ['Drama'],
    duration: 142,
    classification: 'R',
    poster: 'shawshank.jpg',
    releaseDate: new Date('1994-10-14')
  }
];

const theatersData = [
  {
    name: 'Theater 1',
    capacity: 120,
    type: 'standard'
  },
  {
    name: 'Theater 2',
    capacity: 80,
    type: '3D'
  },
  {
    name: 'Theater 3',
    capacity: 60,
    type: 'IMAX'
  }
];


// --- FUNÇÃO PRINCIPAL "INTELIGENTE" ---

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Conectado ao banco de dados...');

    // --- 1. Sincronizando Usuários (Cria se não existir) ---
    for (const userData of usersData) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        await User.create({ ...userData, password: hashedPassword });
        console.log(`✅ Usuário '${userData.name}' criado.`);
      } else {
        console.log(`ℹ️ Usuário '${userData.name}' já existe. Pulando.`);
      }
    }

    // --- 2. Sincronizando Filmes (Cria se não existir) ---
    for (const movieData of moviesData) {
      const existingMovie = await Movie.findOne({ customId: movieData.customId });
      if (!existingMovie) {
        await Movie.create(movieData);
        console.log(`✅ Filme '${movieData.title}' criado.`);
      } else {
        console.log(`ℹ️ Filme '${movieData.title}' já existe. Pulando.`);
      }
    }

    // --- 3. Sincronizando Salas (Cria se não existir) ---
    for (const theaterData of theatersData) {
      const existingTheater = await Theater.findOne({ name: theaterData.name });
      if (!existingTheater) {
        await Theater.create(theaterData);
        console.log(`✅ Sala '${theaterData.name}' criada.`);
      } else {
        console.log(`ℹ️ Sala '${theaterData.name}' já existe. Pulando.`);
      }
    }

    console.log('\nSincronização de dados base concluída com sucesso!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erro durante o processo de seed:', error);
    process.exit(1);
  }
};

// Executa a função
seedDatabase();