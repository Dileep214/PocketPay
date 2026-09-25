import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { WorkerProfile } from '../models/WorkerProfile.js';
import { EmployerProfile } from '../models/EmployerProfile.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/worknear';

const seedData = async () => {
  try {
    console.log(`[Seed Script]: Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed Script]: Connected to MongoDB!');

    // Clear existing data
    console.log('[Seed Script]: Clearing old collections...');
    await Promise.all([
      User.deleteMany({}),
      WorkerProfile.deleteMany({}),
      EmployerProfile.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({})
    ]);

    console.log('[Seed Script]: Creating Admin, Employers, and Workers...');

    // 1. Admin
    const admin = await User.create({
      name: 'WorkNear Admin',
      phone: '+919000000000',
      password: 'password123',
      role: 'admin',
      isPhoneVerified: true
    });

    // 2. Employers
    const employer1 = await User.create({
      name: 'Ravi Teja',
      phone: '+919876500001',
      password: 'password123',
      role: 'employer',
      isPhoneVerified: true
    });

    const employer2 = await User.create({
      name: 'Pooja Reddy',
      phone: '+919876500002',
      password: 'password123',
      role: 'employer',
      isPhoneVerified: true
    });

    const employer3 = await User.create({
      name: 'Suresh Varma',
      phone: '+919876500003',
      password: 'password123',
      role: 'employer',
      isPhoneVerified: true
    });

    // Employer Profiles
    await EmployerProfile.create([
      {
        userId: employer1._id,
        businessName: 'Chai & Bites Cafe',
        businessType: 'Restaurant / Cafe',
        contactPerson: 'Ravi (Owner)',
        address: {
          street: 'Plot 42, Hitech City Road',
          locality: 'Madhapur',
          city: 'Hyderabad',
          pincode: '500081'
        }
      },
      {
        userId: employer2._id,
        businessName: 'Spice Heritage Restaurant',
        businessType: 'Restaurant / Cafe',
        contactPerson: 'Pooja (Manager)',
        address: {
          street: 'Road No 12, Banjara Hills',
          locality: 'Banjara Hills',
          city: 'Hyderabad',
          pincode: '500034'
        }
      },
      {
        userId: employer3._id,
        businessName: 'Kukatpally Daily Mart',
        businessType: 'Retail / Shop',
        contactPerson: 'Suresh',
        address: {
          street: 'Near KPHB Metro Pillar 22',
          locality: 'Kukatpally',
          city: 'Hyderabad',
          pincode: '500072'
        }
      }
    ]);

    // 3. Workers
    const worker1 = await User.create({
      name: 'Kiran Kumar',
      phone: '+919876511111',
      password: 'password123',
      role: 'worker',
      isPhoneVerified: true
    });

    const worker2 = await User.create({
      name: 'Mohammad Ali',
      phone: '+919876522222',
      password: 'password123',
      role: 'worker',
      isPhoneVerified: true
    });

    const worker3 = await User.create({
      name: 'Sunita Bai',
      phone: '+919876533333',
      password: 'password123',
      role: 'worker',
      isPhoneVerified: true
    });

    // Worker Profiles
    await WorkerProfile.create([
      {
        userId: worker1._id,
        bio: 'Reliable with 2 years cafe service experience. Speaks Telugu, Hindi & basic English.',
        locality: 'Madhapur',
        city: 'Hyderabad',
        pincode: '500081',
        skills: ['Waiter', 'Counter Service', 'Coffee Maker'],
        experienceLevel: '1_to_3yrs',
        preferredWage: { amount: 650, type: 'daily' },
        availability: { immediate: true, shift: 'morning' },
        languages: ['Telugu', 'Hindi', 'English']
      },
      {
        userId: worker2._id,
        bio: 'Own two-wheeler with valid driving license. Punctual and knows all Hitec City and Gachibowli routes.',
        locality: 'Gachibowli',
        city: 'Hyderabad',
        pincode: '500032',
        skills: ['Delivery', 'Bike Courier', 'Packaging'],
        experienceLevel: 'under_1yr',
        preferredWage: { amount: 800, type: 'daily' },
        availability: { immediate: true, shift: 'flexible' },
        languages: ['Telugu', 'Hindi', 'Urdu']
      },
      {
        userId: worker3._id,
        bio: 'Hardworking retail helper and shelf organizer. Available for full day shifts.',
        locality: 'Kukatpally',
        city: 'Hyderabad',
        pincode: '500072',
        skills: ['Shelf Stocking', 'Shop Helper', 'Housekeeping'],
        experienceLevel: '1_to_3yrs',
        preferredWage: { amount: 600, type: 'daily' },
        availability: { immediate: true, shift: 'morning' },
        languages: ['Telugu', 'Hindi']
      }
    ]);

    console.log('[Seed Script]: Creating Hyderabad Hyperlocal Jobs...');

    const jobs = await Job.create([
      {
        employerId: employer1._id,
        businessName: 'Chai & Bites Cafe',
        title: 'Cafe Waiter & Floor Staff',
        category: 'Hospitality',
        description: 'Need friendly staff for customer table service and billing assist. Punctuality is appreciated. Free tea & lunch provided on shift.',
        vacancies: 2,
        wage: { amount: 650, type: 'daily', isNegotiable: false },
        workTimings: { shift: 'morning', hoursPerDay: 8 },
        location: {
          addressText: 'Plot 42, Near Ayyappa Society Main Road',
          locality: 'Madhapur',
          city: 'Hyderabad',
          pincode: '500081'
        },
        urgency: 'immediate',
        status: 'active',
        applicantsCount: 1
      },
      {
        employerId: employer2._id,
        businessName: 'Spice Heritage Restaurant',
        title: 'Kitchen Helper & Dishwasher',
        category: 'Hospitality',
        description: 'Need an active helper for vegetable chopping and kitchen utensils cleaning. Fast paced environment with friendly team.',
        vacancies: 2,
        wage: { amount: 700, type: 'daily', isNegotiable: false },
        workTimings: { shift: 'evening', hoursPerDay: 7 },
        location: {
          addressText: 'Road No 12, Beside City Center Mall',
          locality: 'Banjara Hills',
          city: 'Hyderabad',
          pincode: '500034'
        },
        urgency: 'immediate',
        status: 'active',
        applicantsCount: 1
      },
      {
        employerId: employer3._id,
        businessName: 'Kukatpally Daily Mart',
        title: 'Supermarket Helper & Stocker',
        category: 'Retail',
        description: 'Unpacking grocery cartons, stacking shelves, and assisting customer carry bags. Friendly neighborhood store.',
        vacancies: 3,
        wage: { amount: 600, type: 'daily', isNegotiable: false },
        workTimings: { shift: 'morning', hoursPerDay: 8 },
        location: {
          addressText: 'KPHB 3rd Phase, Main Market Road',
          locality: 'Kukatpally',
          city: 'Hyderabad',
          pincode: '500072'
        },
        urgency: 'immediate',
        status: 'active',
        applicantsCount: 0
      },
      {
        employerId: employer1._id,
        businessName: 'Chai & Bites Cafe',
        title: 'Evening Snack Cook & Fryer',
        category: 'Hospitality',
        description: 'Need cook for samosas, puffs, and chai brewing during evening peak rush.',
        vacancies: 1,
        wage: { amount: 800, type: 'daily', isNegotiable: true },
        workTimings: { shift: 'evening', hoursPerDay: 6 },
        location: {
          addressText: 'Opposite Cyber Towers',
          locality: 'Hitec City',
          city: 'Hyderabad',
          pincode: '500081'
        },
        urgency: 'immediate',
        status: 'active',
        applicantsCount: 0
      },
      {
        employerId: employer2._id,
        businessName: 'Spice Heritage Restaurant',
        title: 'Dining Hall Steward',
        category: 'Hospitality',
        description: 'Serving hot food, clearing dishes, and welcoming guests. Neat appearance required.',
        vacancies: 2,
        wage: { amount: 16000, type: 'monthly', isNegotiable: false },
        workTimings: { shift: 'flexible', hoursPerDay: 9 },
        location: {
          addressText: 'Road No 36, Near Metro Station',
          locality: 'Jubilee Hills',
          city: 'Hyderabad',
          pincode: '500033'
        },
        urgency: 'this_week',
        status: 'active',
        applicantsCount: 0
      },
      {
        employerId: employer3._id,
        businessName: 'Kukatpally Daily Mart',
        title: 'Billing Counter Assistant',
        category: 'Retail',
        description: 'Barcode scanning, bagging groceries, handling cash counter. Basic computer comfort needed.',
        vacancies: 1,
        wage: { amount: 15000, type: 'monthly', isNegotiable: false },
        workTimings: { shift: 'morning', hoursPerDay: 8 },
        location: {
          addressText: 'Beside Forum Sujana Mall',
          locality: 'Kukatpally',
          city: 'Hyderabad',
          pincode: '500072'
        },
        urgency: 'this_week',
        status: 'active',
        applicantsCount: 0
      },
      {
        employerId: employer1._id,
        businessName: 'Chai & Bites Cafe',
        title: 'Urgent Delivery Rider',
        category: 'Delivery',
        description: 'Local neighborhood delivery within 3km radius. Own bike and smartphone required. Fuel allowance included.',
        vacancies: 2,
        wage: { amount: 850, type: 'daily', isNegotiable: false },
        workTimings: { shift: 'flexible', hoursPerDay: 8 },
        location: {
          addressText: 'Telecom Nagar, Near DLF Gate 3',
          locality: 'Gachibowli',
          city: 'Hyderabad',
          pincode: '500032'
        },
        urgency: 'immediate',
        status: 'active',
        applicantsCount: 0
      },
      {
        employerId: employer2._id,
        businessName: 'Spice Heritage Catering',
        title: 'Wedding Reception Service Crew',
        category: 'Events',
        description: '1-Day urgent event work: buffet refilling and serving drinks for grand celebration banquet.',
        vacancies: 5,
        wage: { amount: 900, type: 'daily', isNegotiable: false },
        workTimings: { shift: 'evening', hoursPerDay: 6 },
        location: {
          addressText: 'Near Paradise Circle',
          locality: 'Secunderabad',
          city: 'Hyderabad',
          pincode: '500003'
        },
        urgency: 'immediate',
        status: 'active',
        applicantsCount: 0
      },
      {
        employerId: employer3._id,
        businessName: 'Apex Electronics',
        title: 'Electronics Store Helper',
        category: 'Retail',
        description: 'Assisting in moving mobile & laptop boxes, dusting display shelves, and answering customer queries.',
        vacancies: 2,
        wage: { amount: 650, type: 'daily', isNegotiable: false },
        workTimings: { shift: 'morning', hoursPerDay: 8 },
        location: {
          addressText: 'Mytrivanam Commercial Complex',
          locality: 'Ameerpet',
          city: 'Hyderabad',
          pincode: '500038'
        },
        urgency: 'this_week',
        status: 'active',
        applicantsCount: 0
      }
    ]);

    // Create 2 sample applications
    console.log('[Seed Script]: Creating sample applications...');
    await Application.create([
      {
        jobId: jobs[0]._id,
        workerId: worker1._id,
        employerId: employer1._id,
        status: 'shortlisted',
        workerNote: 'I live 5 minutes away in Madhapur and can join today morning!'
      },
      {
        jobId: jobs[1]._id,
        workerId: worker2._id,
        employerId: employer2._id,
        status: 'applied',
        workerNote: 'Available for evening shift.'
      }
    ]);

    console.log('\n======================================================');
    console.log('✅ Seed completed successfully with Hyderabad test data!');
    console.log('------------------------------------------------------');
    console.log('Test Accounts (Password for all: password123)');
    console.log('Worker 1:    +919876511111 (Kiran Kumar - Madhapur)');
    console.log('Worker 2:    +919876522222 (Mohammad Ali - Gachibowli)');
    console.log('Employer 1:  +919876500001 (Ravi Teja - Chai & Bites Cafe)');
    console.log('Employer 2:  +919876500002 (Pooja Reddy - Spice Heritage)');
    console.log('Admin:       +919000000000 (WorkNear Admin)');
    console.log('======================================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Script Error]:', error);
    process.exit(1);
  }
};

seedData();
