import { User } from '../models/index.js';
import config from '../config/index.js';

export async function seedAdmin(): Promise<void> {
    try {
        const existingAdmin = await User.findOne({ email: config.adminEmail });

        if (!existingAdmin) {
            const admin = new User({
                email: config.adminEmail,
                password: config.adminPassword,
                name: 'Admin',
                role: 'super_admin',
            });

            await admin.save();
            console.log(`✅ Admin user created: ${config.adminEmail}`);
        } else {
            console.log(`ℹ️ Admin user already exists: ${config.adminEmail}`);
        }
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
    }
}

export async function seedSampleData(): Promise<void> {
    // This function can be used to seed sample events, team members, etc.
    // for development purposes
    console.log('ℹ️ Sample data seeding not implemented');
}
