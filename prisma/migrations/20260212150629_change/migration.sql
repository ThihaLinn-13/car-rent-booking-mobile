/*
  Warnings:

  - You are about to drop the column `brandId` on the `car` table. All the data in the column will be lost.
  - Added the required column `brand_id` to the `car` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "car" DROP CONSTRAINT "car_brandId_fkey";

-- AlterTable
ALTER TABLE "car" DROP COLUMN "brandId",
ADD COLUMN     "brand_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "car" ADD CONSTRAINT "car_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "car_brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
