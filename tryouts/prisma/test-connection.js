// Test Prisma database connection
const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  try {
    // Test the connection
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Get the database URL (without showing credentials)
    const url = process.env.DATABASE_URL || 'Not set';
    const maskedUrl = url.replace(/:\/\/.*@/, '://****:****@');
    console.log(`Database URL: ${maskedUrl}`);
    
    // Check if our models exist
    console.log('\nChecking database models...');
    const tableCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log(`Found ${tableCount[0].count} tables in the database.`);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
