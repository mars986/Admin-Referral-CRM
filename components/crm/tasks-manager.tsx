"use client";

import { useState } from "react";
import type { TaskRecord } from "@/lib/crm/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/crm/status-badge";
import { formatDateTime } from "@/lib/utils";

export function TasksManager({ initialTasks }: { initialTasks: TaskRecord[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [draft, setDraft] = useState(() => ({
    title: "",
    due_at: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  }));

  async function createTask() {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: draft.title,
        due_at: new Date(draft.due_at).toISOString(),
        status: "Open",
      }),
    });
    const payload = (await response.json()) as { data?: TaskRecord };
    if (payload?.data) {
      const nextTask = payload.data;
      setTasks((current) => [...current, nextTask]);
      setDraft({ title: "", due_at: draft.due_at });
    }
  }

  async function completeTask(task: TaskRecord) {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: task.status === "Completed" ? "Open" : "Completed" }),
    });
    const payload = (await response.json()) as { data?: TaskRecord };
    if (payload?.data) {
      const nextTask = payload.data;
      setTasks((current) => current.map((item) => (item.id === task.id ? nextTask : item)));
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Follow-Up Tasks</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_260px_auto]">
          <Input placeholder="Task title" value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} />
          <Input type="datetime-local" value={draft.due_at} onChange={(event) => setDraft((current) => ({ ...current, due_at: event.target.value }))} />
          <Button onClick={createTask}>Create Task</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <p className="font-semibold text-white">{task.title}</p>
                    <p className="text-xs text-slate-400">{task.description ?? "Lead follow-up"}</p>
                  </TableCell>
                  <TableCell>{formatDateTime(task.due_at)}</TableCell>
                  <TableCell><StatusBadge value={task.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => void completeTask(task)}>
                      {task.status === "Completed" ? "Reopen" : "Complete"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
