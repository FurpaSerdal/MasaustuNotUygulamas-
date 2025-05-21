import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Admin kullanıcısı ekle
  const user = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      password: '1234', // gerçek projede hashleyin, örn: bcrypt
      isAdmin: true,
      notes: {
        create: [
          { title: 'İlk Not', text: 'Bu benim ilk notum.' },
          { title: 'İkinci Not', text: 'Bu da ikinci notum.' },
          { text: 'Başlıksız not da olabilir.' },
        ],
      },
    },
    include: {
      notes: true,
    },
  });

  console.log('Seed verisi eklendi:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



  