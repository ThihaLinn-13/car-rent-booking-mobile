/*
  Warnings:

  - You are about to drop the `car_brands` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cars` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cars" DROP CONSTRAINT "cars_brandId_fkey";

-- DropTable
DROP TABLE "car_brands";

-- DropTable
DROP TABLE "cars";

-- CreateTable
CREATE TABLE "car_brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "car_brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "car_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "car" ADD CONSTRAINT "car_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "car_brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
