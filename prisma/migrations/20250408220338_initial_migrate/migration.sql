-- CreateTable
CREATE TABLE "WeatherRequest" (
    "id" BIGSERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "date_range_start" TIMESTAMP(3) NOT NULL,
    "date_range_end" TIMESTAMP(3) NOT NULL,
    "temperature" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeatherRequest_pkey" PRIMARY KEY ("id")
);
