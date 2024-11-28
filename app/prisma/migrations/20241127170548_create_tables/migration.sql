-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "govEmail" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "agency" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "termsAccepted" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_govEmail_key" ON "User"("govEmail");
