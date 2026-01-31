import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Force load .env from the backend root
// We assume we are running this from 'backend/' directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const uri = process.env.MONGODB_URI || '';
console.log('Testing MongoDB Connection...');
console.log('URI length:', uri.length);
console.log('URI prefix:', uri.substring(0, 15) + '...');

if (!uri) {
    console.error('ERROR: MONGODB_URI is empty');
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('ERROR: Connection failed');
        console.error(err);
        process.exit(1);
    });
