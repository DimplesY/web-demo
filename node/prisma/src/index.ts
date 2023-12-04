import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


async function main() {
    await prisma.$connect()
    const res = await prisma.user.findUnique({where: {id:6}}).post()

    console.dir(JSON.stringify(res))
}


Promise.all([main()])
