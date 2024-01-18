import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const teacher = await prisma.teacher.create({
    data: {
      name: 'test',
    },
  })

  const student = await prisma.student.create({
    data: {
      name: 'John',
    },
  })

  await prisma.studentOfTeacher.create({
    data: {
      studentId: student.id,
      teacherId: teacher.id,
    },
  })
}

prisma.$connect().then(main)
