-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "score" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Time" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "demo" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Score_id_key" ON "Score"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Time_id_key" ON "Time"("id");
