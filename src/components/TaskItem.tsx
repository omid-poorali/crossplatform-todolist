import { Task } from '../entities/Task';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: number) => void;
  onDelete: (taskId: number) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li
      className="group flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-3 transition hover:border-primary hover:bg-slate-800"
    >
      <div className="flex items-center gap-3">
        <button
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as completed'}
          onClick={() => onToggle(task.id)}
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
            task.completed
              ? 'border-primary bg-primary text-slate-900'
              : 'border-slate-500 text-transparent hover:border-primary'
          }`}
        >
          ✓
        </button>
        <div className="flex flex-col">
          <span className={`text-sm font-medium md:text-base ${task.completed ? 'text-slate-400 line-through' : ''}`}>
            {task.title}
          </span>
          <span className="text-[11px] text-slate-500 md:text-xs">
            Updated {new Date(task.updatedAt).toLocaleString()}
          </span>
        </div>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="hidden rounded-lg border border-transparent px-3 py-1 text-xs font-semibold text-slate-400 transition group-hover:block hover:border-red-400 hover:text-red-300"
      >
        Delete
      </button>
    </li>
  );
}
