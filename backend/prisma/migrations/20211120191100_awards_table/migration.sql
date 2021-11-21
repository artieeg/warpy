-- CreateTable
CREATE TABLE "Award" (
    "id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "recipent_id" TEXT NOT NULL,
    "award_id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Award" ADD FOREIGN KEY ("sender_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Award" ADD FOREIGN KEY ("recipent_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Award" ADD FOREIGN KEY ("award_id") REFERENCES "AwardItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
