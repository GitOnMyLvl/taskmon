import { prisma } from '../services/database';

async function cleanupDuplicateMonsters() {
  console.log('🧹 Starting duplicate monster cleanup...');

  try {
    // Get all users
    const users = await prisma.user.findMany({
      include: {
        monsters: true,
      },
    });

    let totalRemoved = 0;

    for (const user of users) {
      console.log(`\n👤 Processing user: ${user.email}`);

      // Group monsters by species
      const monstersBySpecies = user.monsters.reduce(
        (acc, monster) => {
          if (!acc[monster.species]) {
            acc[monster.species] = [];
          }
          acc[monster.species].push(monster);
          return acc;
        },
        {} as Record<string, typeof user.monsters>
      );

      // For each species, keep the one with the most XP (or the first one if tied)
      for (const [species, monsters] of Object.entries(monstersBySpecies)) {
        if (monsters.length > 1) {
          console.log(`  🐉 Found ${monsters.length} ${species} monsters`);

          // Sort by XP (descending) and keep the first one
          const sortedMonsters = monsters.sort((a, b) => b.xp - a.xp);
          const monsterToKeep = sortedMonsters[0];
          const monstersToDelete = sortedMonsters.slice(1);

          console.log(
            `  ✅ Keeping ${species} with ${monsterToKeep.xp} XP (ID: ${monsterToKeep.id})`
          );

          // Delete the duplicates
          for (const monster of monstersToDelete) {
            console.log(
              `  🗑️  Deleting ${species} with ${monster.xp} XP (ID: ${monster.id})`
            );
            await prisma.monster.delete({
              where: { id: monster.id },
            });
            totalRemoved++;
          }

          // If the deleted monster was the active monster, set the kept monster as active
          if (
            user.activeMonsterId &&
            monstersToDelete.some(m => m.id === user.activeMonsterId)
          ) {
            await prisma.user.update({
              where: { id: user.id },
              data: { activeMonsterId: monsterToKeep.id },
            });
            console.log(`  🔄 Updated active monster to ${monsterToKeep.id}`);
          }
        }
      }
    }

    console.log(
      `\n🎉 Cleanup completed! Removed ${totalRemoved} duplicate monsters.`
    );

    // Verify the cleanup
    const finalUsers = await prisma.user.findMany({
      include: {
        monsters: true,
      },
    });

    console.log('\n📊 Final monster count per user:');
    for (const user of finalUsers) {
      console.log(`  ${user.email}: ${user.monsters.length} monsters`);
      for (const monster of user.monsters) {
        console.log(`    - ${monster.species} (${monster.xp} XP)`);
      }
    }
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicateMonsters();
