-- CreateTable
CREATE TABLE "match_summaries" (
    "matchId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ranking" JSONB NOT NULL,
    "winner_stats" JSONB,
    "performance_metrics" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "match_summaries_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "match_summaries_matchId_key" ON "match_summaries"("matchId");
