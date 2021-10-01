-- CreateTable
CREATE TABLE "FollowRecord" (
    "id" TEXT NOT NULL,
    "follower_id" TEXT NOT NULL,
    "followed_id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_follow_index" ON "FollowRecord"("follower_id", "followed_id");

-- AddForeignKey
ALTER TABLE "FollowRecord" ADD FOREIGN KEY ("follower_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowRecord" ADD FOREIGN KEY ("followed_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
