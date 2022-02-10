-- CreateTable
CREATE TABLE "WaitlistRecord" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistRecord.username_unique" ON "WaitlistRecord"("username");

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistRecord.email_unique" ON "WaitlistRecord"("email");
