const fs = require('fs');
const path = require('path');

const target = (process.argv[2] || '').toLowerCase();
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');

if (!fs.existsSync(schemaPath)) {
  console.error('Schema not found at:', schemaPath);
  process.exit(1);
}

let content = fs.readFileSync(schemaPath, 'utf8');

if (target === 'postgresql' || target === 'postgres') {
  content = content.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  console.log('✅ Switched Prisma schema provider to: postgresql');
} else if (target === 'sqlite') {
  content = content.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  console.log('✅ Switched Prisma schema provider to: sqlite');
} else {
  // Auto-detect based on DATABASE_URL
  const dbUrl = process.env.DATABASE_URL || '';
  if (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')) {
    content = content.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
    console.log('✅ Auto-detected PostgreSQL connection string. Switched provider to: postgresql');
  } else {
    content = content.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
    console.log('✅ Auto-detected SQLite connection string. Switched provider to: sqlite');
  }
}

fs.writeFileSync(schemaPath, content, 'utf8');
