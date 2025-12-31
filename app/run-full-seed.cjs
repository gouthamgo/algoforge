const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

// Import and run the full seed
async function main() {
  console.log("Running full lesson content seed...");
  
  // Require the seed module (compiled from TypeScript)
  // We'll need to run the actual dbSeeds.ts through wasp's build system
  // For now, let's just verify the database connection works
  
  const topics = await prismaClient.topic.findMany();
  console.log("Found", topics.length, "topics");
  
  const patterns = await prismaClient.pattern.findMany();
  console.log("Found", patterns.length, "patterns");
  
  const problems = await prismaClient.problem.findMany();
  console.log("Found", problems.length, "problems");
}

main()
  .then(() => prismaClient.$disconnect())
  .catch((e) => {
    console.error(e);
    prismaClient.$disconnect();
    process.exit(1);
  });
