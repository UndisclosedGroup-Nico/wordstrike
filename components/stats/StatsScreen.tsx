"use client";

import { useEffect, useMemo, useState } from "react";
import { getGameResults, rankResults } from "@/lib/db/games";
import { computeStatistics } from "@/lib/db/stats";
import { difficultyLabel, formatDate, modeLabel } from "@/lib/format";
import type { GameResult, LeaderboardMetric, Statistics } from "@/types/game";
import type { Difficulty, GameMode } from "@/types/settings";

const metrics: Array<{ id: LeaderboardMetric; label: string }> = [
  { id: "wpm", label: "Highest WPM" },
  { id: "score", label: "Highest Score" },
  { id: "accuracy", label: "Highest Accuracy" },
  { id: "maxCombo", label: "Highest Combo" },
  { id: "damageDealt", label: "Most Damage" },
];

export function StatsScreen() {
  const [results, setResults] = useState<GameResult[]>([]);
  const [metric, setMetric] = useState<LeaderboardMetric>("score");
  const [mode, setMode] = useState<GameMode | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [sortKey, setSortKey] = useState<keyof GameResult>("timestamp");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    void getGameResults().then(setResults);
  }, []);

  const stats: Statistics = useMemo(() => computeStatistics(results), [results]);
  const board = useMemo(
    () => rankResults(results, { metric, mode, difficulty, limit: 15 }),
    [results, metric, mode, difficulty],
  );
  const recent = useMemo(() => {
    const copy = [...results];
    copy.sort((a, b) => {
      const left = a[sortKey];
      const right = b[sortKey];
      if (typeof left === "number" && typeof right === "number") {
        return sortDir === "desc" ? right - left : left - right;
      }
      return sortDir === "desc"
        ? String(right).localeCompare(String(left))
        : String(left).localeCompare(String(right));
    });
    return copy.slice(0, 30);
  }, [results, sortKey, sortDir]);

  function toggleSort(key: keyof GameResult) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
      return;
    }
    setSortKey(key);
    setSortDir("desc");
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8">
      <header>
        <h1 className="font-display text-4xl tracking-wide">Stats / History</h1>
        <p className="mt-2 text-sm text-fog">Local arcade cabinet. Nobody else can see this.</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Games" value={String(stats.totalGames)} />
        <Card label="Best WPM" value={stats.bestWpm.toFixed(0)} />
        <Card label="Best Acc" value={`${stats.bestAccuracy.toFixed(1)}%`} />
        <Card label="High Score" value={stats.highestScore.toLocaleString()} />
        <Card label="Max Combo" value={`x${stats.highestCombo}`} />
        <Card label="Most Damage" value={stats.mostDamage.toLocaleString()} />
        <Card label="Avg WPM" value={stats.averageWpm.toFixed(1)} />
        <Card label="Avg Acc" value={`${stats.averageAccuracy.toFixed(1)}%`} />
      </section>

      <section className="rounded-2xl border border-line bg-panel/70 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl tracking-wide">Leaderboard</h2>
          <div className="flex flex-wrap gap-2">
            <select className="input" value={mode} onChange={(e) => setMode(e.target.value as GameMode | "all")}>
              <option value="all">All modes</option>
              <option value="classic">Classic</option>
              <option value="timeAttack">Time Attack</option>
              <option value="endless">Endless</option>
              <option value="boss">Boss</option>
            </select>
            <select
              className="input"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty | "all")}
            >
              <option value="all">All difficulties</option>
              <option value="easy">Easy</option>
              <option value="normal">Normal</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {metrics.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMetric(item.id)}
              className={`rounded-md px-3 py-1.5 text-xs uppercase tracking-[0.16em] ${
                metric === item.id ? "bg-mint text-ink" : "border border-line text-fog"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {board.length === 0 ? (
          <p className="text-sm text-fog">No ranked runs yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="text-[10px] uppercase tracking-[0.18em] text-fog">
                <tr>
                  <th className="py-2">#</th>
                  <th>WPM</th>
                  <th>Acc</th>
                  <th>Score</th>
                  <th>Combo</th>
                  <th>Mode</th>
                </tr>
              </thead>
              <tbody>
                {board.map((row, index) => (
                  <tr
                    key={row.id}
                    className={index === 0 ? "bg-mint/10 text-mint" : "border-t border-line"}
                  >
                    <td className="py-2 font-display">{index + 1}</td>
                    <td>{row.wpm.toFixed(0)}</td>
                    <td>{row.accuracy.toFixed(0)}%</td>
                    <td>{row.score.toLocaleString()}</td>
                    <td>x{row.maxCombo}</td>
                    <td>{modeLabel(row.mode)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-line bg-panel/70 p-5">
        <h2 className="mb-4 font-display text-2xl tracking-wide">Recent runs</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-fog">Finish a fight to fill this table.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-[10px] uppercase tracking-[0.18em] text-fog">
                <tr>
                  <Th onClick={() => toggleSort("timestamp")}>Date</Th>
                  <Th onClick={() => toggleSort("mode")}>Mode</Th>
                  <Th onClick={() => toggleSort("difficulty")}>Diff</Th>
                  <Th onClick={() => toggleSort("wpm")}>WPM</Th>
                  <Th onClick={() => toggleSort("accuracy")}>Acc</Th>
                  <Th onClick={() => toggleSort("score")}>Score</Th>
                  <Th onClick={() => toggleSort("maxCombo")}>Combo</Th>
                </tr>
              </thead>
              <tbody>
                {recent.map((row) => (
                  <tr key={row.id} className="border-t border-line">
                    <td className="py-2">{formatDate(row.timestamp)}</td>
                    <td>{modeLabel(row.mode)}</td>
                    <td>{difficultyLabel(row.difficulty)}</td>
                    <td>{row.wpm.toFixed(0)}</td>
                    <td>{row.accuracy.toFixed(1)}%</td>
                    <td>{row.score.toLocaleString()}</td>
                    <td>x{row.maxCombo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-ink/50 px-4 py-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-fog">{label}</div>
      <div className="mt-1 font-display text-2xl">{value}</div>
    </div>
  );
}

function Th({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <th>
      <button
        type="button"
        onClick={onClick}
        className="py-2 text-left uppercase tracking-[0.18em] hover:text-paper"
      >
        {children}
      </button>
    </th>
  );
}
