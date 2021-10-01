-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reporter_id" TEXT NOT NULL,
    "reported_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Report.reporter_id_unique" ON "Report"("reporter_id");

-- CreateIndex
CREATE UNIQUE INDEX "Report.reported_id_unique" ON "Report"("reported_id");

-- AddForeignKey
ALTER TABLE "Report" ADD FOREIGN KEY ("reporter_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD FOREIGN KEY ("reported_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
