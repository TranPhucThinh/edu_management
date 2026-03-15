-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "academicYear" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "gradeLabel" TEXT,
ADD COLUMN     "level" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT;
