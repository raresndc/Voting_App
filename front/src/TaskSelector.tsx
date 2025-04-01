import React from 'react';

interface TaskSelectorProps {
  tasks: string[];
}

const TaskSelector: React.FC<TaskSelectorProps> = ({ tasks }) => {
  return (
    <div className="flex grow shrink gap-6 items-start self-stretch my-auto text-xs font-bold uppercase min-w-[240px] w-[298px]">
      {tasks.map((task, index) => (
        <button
          key={index}
          className={`gap-3 self-stretch px-4 py-3 rounded-lg ${
            index === 0 ? 'text-sky-900 bg-zinc-100' : 'border-solid border-[1.12px] border-zinc-100 text-zinc-100'
          }`}
        >
          {task}
        </button>
      ))}
    </div>
  );
};

export default TaskSelector;