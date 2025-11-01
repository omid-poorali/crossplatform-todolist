import { FormEvent, useState } from 'react';
import { TaskItem } from './components/TaskItem';
import { VersionBanner } from './components/VersionBanner';
import { useTasks } from './hooks/useTasks';

export default function App() {
  const [title, setTitle] = useState('');
  const { tasks, loading, versionChange, addTask, toggleTask, deleteTask, clearCompleted } = useTasks();

  const incompleteCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.length - incompleteCount;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;
    await addTask(title);
    setTitle('');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-transparent px-4 py-10 text-slate-100 md:px-6">
      <div className="w-full max-w-2xl">
        <header className="mb-8 flex flex-col gap-2 text-center md:text-left">
          <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-lg md:text-5xl">
            Cross-Platform To-Do
          </h1>
          <p className="text-sm text-slate-300 md:text-base">
            Built with React, Vite, Tailwind, and TypeORM using SQLite for offline-ready persistence. Works across desktop
            and mobile through a single codebase.
          </p>
        </header>

        <VersionBanner versionChange={versionChange} />

        <form
          onSubmit={handleSubmit}
          className="mb-6 flex flex-col gap-3 rounded-2xl bg-slate-800/60 p-4 shadow-xl shadow-slate-950/50 backdrop-blur"
        >
          <label htmlFor="task-title" className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Add a task
          </label>
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What do you need to get done?"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-primary-dark"
            >
              Add Task
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 md:text-sm">
            <span>{incompleteCount} {incompleteCount === 1 ? 'task' : 'tasks'} remaining</span>
            <span>{completedCount} completed</span>
            <button
              type="button"
              onClick={clearCompleted}
              className="rounded-lg border border-transparent px-3 py-1 text-xs font-semibold text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
            >
              Clear completed
            </button>
          </div>
        </form>

        <section className="space-y-3">
          {loading && (
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4 text-center text-sm text-slate-400">
              Preparing local database...
            </div>
          )}

          {!loading && tasks.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-700/60 bg-slate-800/40 p-6 text-center text-sm text-slate-400">
              Create your first task to get started.
            </div>
          )}

          <ul className="space-y-3">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
