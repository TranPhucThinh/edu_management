/*
  Warnings:

  - A unique constraint covering the columns `[studentId,classId,period]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Invoice_studentId_classId_period_key" ON "Invoice"("studentId", "classId", "period");
