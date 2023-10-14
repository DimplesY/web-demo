import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


async function main() {
    await prisma.$connect()
    // const allUsers = await prisma.user.create({
    //   data: {
    //       username: "Alice2",
    //       email: "1233",
    //       password: "123",
    //       posts: {
    //         create: {
    //           title: "Join us for Prisma Day 2020",
    //           content: "https://www.prisma.io/day/",
    //           published: true,
    //         }
    //       }
    //   },
    // })
    // console.log(allUsers);

    const res = await prisma.user.findUnique({where: {id:6}}).post()

    console.dir(JSON.stringify(res))
}


Promise.all([main()])
