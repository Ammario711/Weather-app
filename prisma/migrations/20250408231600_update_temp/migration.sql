/*
  Warnings:

  - You are about to drop the column `temperature` on the `WeatherRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WeatherRequest" DROP COLUMN "temperature",
ADD COLUMN     "temperatures" JSONB;
