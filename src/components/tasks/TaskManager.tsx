import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Shield,
  Briefcase,
  Gift,
  Key,
  Filter
} from 'lucide-react';
import { TaskItem, UserProfile } from '../../types';

interface TaskManagerProps {
  tasks?: TaskItem[];
  user: UserProfile;
  onAddTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => Promise<void>;
  onUpdateTaskStatus: (taskId: string, status: TaskItem['status']) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks = [],
  user,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
  onShowToast,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<TaskItem['category']>('TRADING');
  const [newPriority, setNewPriority] = useState<TaskItem['priority']>('MEDIUM');
  const [newDueDate, setNewDueDate] = useState('Tomorrow');
  const [newReward, setNewReward] = useState<number>(25);

  const filteredTasks = (tasks || []).filter((t) => {
    if (filterCategory !== 'ALL' && t.category !== filterCategory) return false;
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    return true;
  });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      onShowToast('Please enter a task title', 'error');
      return;
    }

    try {
      await onAddTask({
        userId: user.id,
        title: newTitle.trim(),
        description: newDescription.trim(),
        category: newCategory,
        status: 'TODO',
        priority: newPriority,
        dueDate: newDueDate,
        reward: newReward,
      });
      setShowAddModal(false);
      setNewTitle('');
      setNewDescription('');
      onShowToast('New compliance task created successfully', 'success');
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to create task', 'error');
    }
  };

  const getCategoryIcon = (category: TaskItem['category']) => {
    switch (category) {
      case 'COMPLIANCE':
        return <Shield className="w-4 h-4 text-emerald-400" />;
      case 'TRADING':
        return <Briefcase className="w-4 h-4 text-amber-400" />;
      case 'REWARD':
        return <Gift className="w-4 h-4 text-purple-400" />;
      case 'SECURITY':
        return <Key className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Stats */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Task & Compliance Management Dashboard
              </h2>
              <p className="text-xs text-slate-400">
                Track KYC verification objectives, daily yield actions, and trading risk checkpoints
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Task / Objective</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 font-semibold px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {(['ALL', 'COMPLIANCE', 'TRADING', 'REWARD', 'SECURITY'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterCategory === cat
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Status:</span>
          {(['ALL', 'TODO', 'IN_PROGRESS', 'COMPLETED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterStatus === st
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => {
          const isDone = task.status === 'COMPLETED';
          const isInProgress = task.status === 'IN_PROGRESS';

          return (
            <div
              key={task.id}
              className={`bg-slate-900/90 border rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all ${
                isDone
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                      {getCategoryIcon(task.category)}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      {task.category}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.priority === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : task.priority === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {task.priority} Priority
                  </span>
                </div>

                <h4
                  className={`text-sm font-bold leading-snug mb-1.5 ${
                    isDone ? 'line-through text-slate-400' : 'text-white'
                  }`}
                >
                  {task.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {task.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Due: {task.dueDate}
                  </span>
                  {task.reward && (
                    <span className="flex items-center gap-1 font-mono font-bold text-amber-400">
                      <Award className="w-3.5 h-3.5" /> +${task.reward} Bonus
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onUpdateTaskStatus(task.id, isDone ? 'TODO' : 'COMPLETED')
                    }
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isDone
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isDone ? 'Mark as Open' : 'Complete Task'}</span>
                  </button>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-1">Create New Objective / Task</h3>
            <p className="text-xs text-slate-400 mb-4">
              Add a trading or compliance task to your account agenda
            </p>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Verify Proof of Address for Level 2"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Details, requirements, or documentation links..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="COMPLIANCE">Compliance</option>
                    <option value="TRADING">Trading</option>
                    <option value="REWARD">Reward</option>
                    <option value="SECURITY">Security</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Due Date</label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Reward ($ Bonus)</label>
                  <input
                    type="number"
                    value={newReward}
                    onChange={(e) => setNewReward(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
