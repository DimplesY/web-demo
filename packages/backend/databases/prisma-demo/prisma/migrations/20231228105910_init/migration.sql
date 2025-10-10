/*
  Warnings:

  - You are about to drop the `_StudentToTeacher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_StudentToTeacher` DROP FOREIGN KEY `_StudentToTeacher_A_fkey`;

-- DropForeignKey
ALTER TABLE `_StudentToTeacher` DROP FOREIGN KEY `_StudentToTeacher_B_fkey`;

-- DropTable
DROP TABLE `_StudentToTeacher`;

-- CreateTable
CREATE TABLE `StudentOfTeacher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `teacherId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudentOfTeacher` ADD CONSTRAINT `StudentOfTeacher_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentOfTeacher` ADD CONSTRAINT `StudentOfTeacher_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
