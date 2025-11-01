import { useCallback, useEffect, useRef, useState } from 'react';
import type { Repository } from 'typeorm';
import { initializeDatabase, type VersionChange } from '../db';
import { Task } from '../entities/Task';

export interface UseTasksState {
  tasks: Task[];
  loading: boolean;
  versionChange: VersionChange | null;
  addTask: (title: string) => Promise<void>;
  toggleTask: (taskId: number) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  clearCompleted: () => Promise<void>;
}

export function useTasks(): UseTasksState {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [versionChange, setVersionChange] = useState<VersionChange | null>(null);
  const repositoryRef = useRef<Repository<Task> | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const { dataSource, versionChange: vc } = await initializeDatabase();
      const repo = dataSource.getRepository(Task);
      repositoryRef.current = repo;
      const loadedTasks = await repo.find({
        order: { createdAt: 'DESC' }
      });
      if (!isMounted) return;
      setTasks(loadedTasks);
      setVersionChange(vc);
      setLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const addTask = useCallback(async (title: string) => {
    const repo = repositoryRef.current;
    if (!repo) return;
    const trimmed = title.trim();
    if (!trimmed) return;
    const now = new Date().toISOString();
    const task = repo.create({
      title: trimmed,
      completed: false,
      createdAt: now,
      updatedAt: now
    });
    const saved = await repo.save(task);
    setTasks((prev) => [saved, ...prev]);
  }, []);

  const toggleTask = useCallback(async (taskId: number) => {
    const repo = repositoryRef.current;
    if (!repo) return;
    const task = await repo.findOne({ where: { id: taskId } });
    if (!task) return;
    task.completed = !task.completed;
    task.updatedAt = new Date().toISOString();
    await repo.save(task);
    setTasks((prev) => prev.map((item) => (item.id === task.id ? { ...task } : item)));
  }, []);

  const deleteTask = useCallback(async (taskId: number) => {
    const repo = repositoryRef.current;
    if (!repo) return;
    await repo.delete(taskId);
    setTasks((prev) => prev.filter((item) => item.id !== taskId));
  }, []);

  const clearCompleted = useCallback(async () => {
    const repo = repositoryRef.current;
    if (!repo) return;
    const completedTasks = tasks.filter((task) => task.completed);
    if (completedTasks.length === 0) return;
    const ids = completedTasks.map((task) => task.id);
    await repo.delete(ids);
    setTasks((prev) => prev.filter((task) => !task.completed));
  }, [tasks]);

  return { tasks, loading, versionChange, addTask, toggleTask, deleteTask, clearCompleted };
}
