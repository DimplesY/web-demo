import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function selectAndCreate() {
  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
      posts: {
        create: { title: 'Hello World' },
      },
      profile: {
        create: { bio: 'I like turtles' },
      },
    },
  })

  const users = await prisma.user.findMany({
    include: {
      posts: true, // 关联查询
      profile: true, // 关联查询
    },
  })
  console.dir(users)
}

async function selectAndUpdate() {
  const post = await prisma.post.update({
    where: { id: 1 },
    data: { published: false },
  })
  console.log(post)
}

selectAndUpdate()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
