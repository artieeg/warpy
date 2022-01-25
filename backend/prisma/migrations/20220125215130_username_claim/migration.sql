-- CreateTable
CREATE TABLE "UsernameClaim" (
    "ip_hash" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    PRIMARY KEY ("ip_hash")
);
