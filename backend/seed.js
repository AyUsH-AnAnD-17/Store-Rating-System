// seed.js - MongoDB Seed Data Script
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/store-rating', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 60,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    maxlength: 400,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'store_owner'],
    default: 'user'
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Store Schema
const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 60,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  address: {
    type: String,
    required: true,
    maxlength: 400,
    trim: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Rating Schema
const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 500,
    trim: true
  }
}, {
  timestamps: true
});

// Create models
const User = mongoose.model('User', userSchema);
const Store = mongoose.model('Store', storeSchema);
const Rating = mongoose.model('Rating', ratingSchema);

// Hash password function
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Store.deleteMany({});
    await Rating.deleteMany({});
    console.log('Cleared existing data');

    // Create System Administrator
    const adminPassword = await hashPassword('Admin123!');
    const admin = await User.create({
      name: 'System Administrator John Doe',
      email: 'admin@storerating.com',
      password: adminPassword,
      address: '123 Admin Street, Administrative District, Admin City, State 12345',
      role: 'admin'
    });
    console.log('✅ Admin user created');

    // Create Normal Users
    const normalUsers = [];
    const userPasswordHash = await hashPassword('User123!');
    
    const userData = [
      {
        name: 'Alice Johnson Smith Williams',
        email: 'alice.johnson@email.com',
        address: '456 Oak Avenue, Residential Area, Springfield, IL 62701'
      },
      {
        name: 'Bob Thompson Brown Davis',
        email: 'bob.thompson@email.com',
        address: '789 Pine Street, Suburb Heights, Chicago, IL 60601'
      },
      {
        name: 'Charlie Wilson Garcia Martinez',
        email: 'charlie.wilson@email.com',
        address: '321 Maple Drive, Green Valley, Aurora, IL 60502'
      },
      {
        name: 'Diana Rodriguez Lopez Gonzalez',
        email: 'diana.rodriguez@email.com',
        address: '654 Cedar Lane, Hillside Manor, Rockford, IL 61101'
      },
      {
        name: 'Edward Lee Park Kim Anderson',
        email: 'edward.lee@email.com',
        address: '987 Birch Boulevard, Riverside Community, Peoria, IL 61602'
      },
      {
        name: 'Fiona White Taylor Moore Jackson',
        email: 'fiona.white@email.com',
        address: '147 Elm Court, Sunset Hills, Naperville, IL 60540'
      },
      {
        name: 'George Martin Clark Lewis Walker',
        email: 'george.martin@email.com',
        address: '258 Willow Way, Garden District, Joliet, IL 60431'
      },
      {
        name: 'Hannah Davis Miller Wilson Young',
        email: 'hannah.davis@email.com',
        address: '369 Spruce Street, Valley View, Elgin, IL 60120'
      }
    ];

    for (const user of userData) {
      const newUser = await User.create({
        ...user,
        password: userPasswordHash,
        role: 'user'
      });
      normalUsers.push(newUser);
    }
    console.log('✅ Normal users created');

    // Create Store Owners and their Stores
    const storeOwners = [];
    const stores = [];
    const ownerPasswordHash = await hashPassword('Owner123!');

    const storeData = [
      {
        ownerName: 'Michael Restaurant Owner Thompson',
        ownerEmail: 'michael.owner@pizzapalace.com',
        ownerAddress: '100 Business District, Commercial Zone, Chicago, IL 60602',
        storeName: 'Pizza Palace Restaurant & Grill',
        storeEmail: 'contact@pizzapalace.com',
        storeAddress: '100 Business District, Commercial Zone, Chicago, IL 60602'
      },
      {
        ownerName: 'Sarah Coffee Shop Manager Williams',
        ownerEmail: 'sarah.manager@coffeehaven.com',
        ownerAddress: '200 Main Street, Downtown Area, Springfield, IL 62702',
        storeName: 'Coffee Haven Specialty Drinks',
        storeEmail: 'hello@coffeehaven.com',
        storeAddress: '200 Main Street, Downtown Area, Springfield, IL 62702'
      },
      {
        ownerName: 'David Electronics Store Owner Johnson',
        ownerEmail: 'david.owner@techworld.com',
        ownerAddress: '300 Technology Park, Innovation District, Aurora, IL 60503',
        storeName: 'Tech World Electronics Store',
        storeEmail: 'support@techworld.com',
        storeAddress: '300 Technology Park, Innovation District, Aurora, IL 60503'
      },
      {
        ownerName: 'Jessica Bookstore Manager Davis',
        ownerEmail: 'jessica.manager@bookworm.com',
        ownerAddress: '400 Literary Lane, Arts Quarter, Rockford, IL 61102',
        storeName: 'The Bookworm Literary Haven',
        storeEmail: 'info@bookworm.com',
        storeAddress: '400 Literary Lane, Arts Quarter, Rockford, IL 61102'
      },
      {
        ownerName: 'Robert Fitness Center Owner Martinez',
        ownerEmail: 'robert.owner@fitnesshub.com',
        ownerAddress: '500 Health Boulevard, Wellness District, Peoria, IL 61603',
        storeName: 'Fitness Hub Health & Wellness',
        storeEmail: 'contact@fitnesshub.com',
        storeAddress: '500 Health Boulevard, Wellness District, Peoria, IL 61603'
      },
      {
        ownerName: 'Lisa Fashion Store Owner Anderson',
        ownerEmail: 'lisa.owner@stylista.com',
        ownerAddress: '600 Fashion Avenue, Shopping District, Naperville, IL 60541',
        storeName: 'Stylista Fashion Boutique Store',
        storeEmail: 'hello@stylista.com',
        storeAddress: '600 Fashion Avenue, Shopping District, Naperville, IL 60541'
      },
      {
        ownerName: 'James Grocery Store Manager Wilson',
        ownerEmail: 'james.manager@freshmart.com',
        ownerAddress: '700 Market Street, Trade Center, Joliet, IL 60432',
        storeName: 'Fresh Mart Grocery & Deli',
        storeEmail: 'service@freshmart.com',
        storeAddress: '700 Market Street, Trade Center, Joliet, IL 60432'
      },
      {
        ownerName: 'Amanda Beauty Salon Owner Garcia',
        ownerEmail: 'amanda.owner@glamour.com',
        ownerAddress: '800 Beauty Boulevard, Style District, Elgin, IL 60121',
        storeName: 'Glamour Beauty Salon & Spa',
        storeEmail: 'appointments@glamour.com',
        storeAddress: '800 Beauty Boulevard, Style District, Elgin, IL 60121'
      }
    ];

    for (const data of storeData) {
      // Create store owner
      const owner = await User.create({
        name: data.ownerName,
        email: data.ownerEmail,
        password: ownerPasswordHash,
        address: data.ownerAddress,
        role: 'store_owner'
      });

      // Create store
      const store = await Store.create({
        name: data.storeName,
        email: data.storeEmail,
        address: data.storeAddress,
        ownerId: owner._id
      });

      // Update owner with store reference
      owner.storeId = store._id;
      await owner.save();

      storeOwners.push(owner);
      stores.push(store);
    }
    console.log('✅ Store owners and stores created');

    // Create Ratings
    const ratings = [];
    const comments = [
      'Excellent service and great quality!',
      'Very satisfied with my experience here.',
      'Good value for money, will come again.',
      'Outstanding customer service and products.',
      'Average experience, room for improvement.',
      'Fantastic place, highly recommended!',
      'Great atmosphere and friendly staff.',
      'Could be better, but not bad overall.',
      'Amazing quality and quick service.',
      'Wonderful experience, exceeded expectations!',
      'Decent service, fair pricing.',
      'Impressive selection and helpful staff.',
      'Nice place, will definitely return.',
      'Good experience overall, satisfied.',
      'Excellent quality and professional service.'
    ];

    // Each normal user rates 3-6 random stores
    for (const user of normalUsers) {
      const numberOfRatings = Math.floor(Math.random() * 4) + 3; // 3-6 ratings
      const shuffledStores = stores.sort(() => 0.5 - Math.random());
      const storesToRate = shuffledStores.slice(0, numberOfRatings);

      for (const store of storesToRate) {
        const rating = Math.floor(Math.random() * 5) + 1; // 1-5 rating
        const comment = comments[Math.floor(Math.random() * comments.length)];
        
        const newRating = await Rating.create({
          userId: user._id,
          storeId: store._id,
          rating: rating,
          comment: rating >= 4 ? comment : (rating === 3 ? 'Average experience, room for improvement.' : 'Could be better, but not bad overall.')
        });
        ratings.push(newRating);
      }
    }
    console.log('✅ Ratings created');

    // Update store ratings
    for (const store of stores) {
      const storeRatings = await Rating.find({ storeId: store._id });
      const totalRatings = storeRatings.length;
      const averageRating = totalRatings > 0 
        ? storeRatings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings 
        : 0;
      
      await Store.findByIdAndUpdate(store._id, {
        averageRating: parseFloat(averageRating.toFixed(2)),
        totalRatings: totalRatings
      });
    }
    console.log('✅ Store ratings updated');

    // Create additional admin users
    const additionalAdmins = [
      {
        name: 'Senior Administrator Jane Smith',
        email: 'jane.admin@storerating.com',
        password: await hashPassword('Admin456!'),
        address: '456 Administrative Plaza, Management District, Springfield, IL 62703'
      },
      {
        name: 'System Manager Robert Brown',
        email: 'robert.admin@storerating.com',
        password: await hashPassword('Admin789!'),
        address: '789 Control Center, Operations Hub, Chicago, IL 60603'
      }
    ];

    for (const adminData of additionalAdmins) {
      await User.create({
        ...adminData,
        role: 'admin'
      });
    }
    console.log('✅ Additional admin users created');

    // Print summary
    console.log('\n🎉 SEED DATA CREATION COMPLETED! 🎉\n');
    console.log('='.repeat(50));
    console.log('📊 DATABASE SUMMARY:');
    console.log('='.repeat(50));
    
    const totalUsers = await User.countDocuments();
    const totalStores = await Store.countDocuments();
    const totalRatings = await Rating.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments({ role: 'user' });
    const ownerCount = await User.countDocuments({ role: 'store_owner' });

    console.log(`👥 Total Users: ${totalUsers}`);
    console.log(`   📋 Admins: ${adminCount}`);
    console.log(`   👤 Normal Users: ${userCount}`);
    console.log(`   🏪 Store Owners: ${ownerCount}`);
    console.log(`🏬 Total Stores: ${totalStores}`);
    console.log(`⭐ Total Ratings: ${totalRatings}`);
    
    console.log('\n' + '='.repeat(50));
    console.log('🔐 LOGIN CREDENTIALS:');
    console.log('='.repeat(50));
    console.log('👨‍💼 ADMIN USERS:');
    console.log('   Email: admin@storerating.com');
    console.log('   Password: Admin123!');
    console.log('   ---');
    console.log('   Email: jane.admin@storerating.com');
    console.log('   Password: Admin456!');
    console.log('   ---');
    console.log('   Email: robert.admin@storerating.com');
    console.log('   Password: Admin789!');
    
    console.log('\n👤 SAMPLE NORMAL USERS:');
    console.log('   Email: alice.johnson@email.com');
    console.log('   Password: User123!');
    console.log('   ---');
    console.log('   Email: bob.thompson@email.com');
    console.log('   Password: User123!');
    
    console.log('\n🏪 SAMPLE STORE OWNERS:');
    console.log('   Email: michael.owner@pizzapalace.com');
    console.log('   Password: Owner123!');
    console.log('   Store: Pizza Palace Restaurant & Grill');
    console.log('   ---');
    console.log('   Email: sarah.manager@coffeehaven.com');
    console.log('   Password: Owner123!');
    console.log('   Store: Coffee Haven Specialty Drinks');

    console.log('\n' + '='.repeat(50));
    console.log('🧪 TESTING FEATURES:');
    console.log('='.repeat(50));
    console.log('✅ All users have proper 20-60 character names');
    console.log('✅ All passwords include uppercase + special characters');
    console.log('✅ All addresses are under 400 characters');
    console.log('✅ All emails follow proper validation format');
    console.log('✅ Stores have realistic average ratings');
    console.log('✅ Users have submitted multiple ratings');
    console.log('✅ Store owners are linked to their stores');
    console.log('✅ Ready for testing all system functionalities');

    console.log('\n' + '='.repeat(50));
    console.log('NEXT STEPS:');
    console.log('='.repeat(50));
    console.log('1. Start your backend server');
    console.log('2. Use the login credentials above to test different user roles');
    console.log('3. Test admin dashboard, user ratings, store owner features');
    console.log('4. Test search, filtering, sorting functionalities');
    console.log('5. Test password updates and user management');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// Run the seed script
const runSeed = async () => {
  await connectDB();
  await seedData();
  await mongoose.connection.close();
  console.log('\n✅ Database connection closed');
  console.log('🎯 Seed script completed successfully!\n');
  process.exit(0);
};

// Execute if running directly
if (require.main === module) {
  runSeed();
}

module.exports = { runSeed, User, Store, Rating };