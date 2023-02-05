import { PrismaClient } from "@prisma/client";
import { faker } from '@faker-js/faker';
// import { faker } from '@faker-js/faker/locale/de';

const USERS_TO_CREATE = 20;

const prisma = new PrismaClient()

// prisma.$queryRawUnsafe('SELECT * FROM post WHERE id = $1 ', 5)
//   .then(console.log)
const run = async () => {
  const postData = Array(USERS_TO_CREATE)
    .fill(null)
    .map(() => ({
      title: faker.lorem.paragraph()
    }))
  const createPosts = postData.map(item => prisma.post.create({ data: item }))
  const posts = await prisma.$transaction(createPosts)
}
run().catch(err => {
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()

})