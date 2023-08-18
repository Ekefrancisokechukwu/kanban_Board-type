import { useMemo, useState } from "react";
import { Id, Tasks, column } from "../types";
import { CiMenuKebab } from "react-icons/ci";
import { useSortable, SortableContext } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SingleTask from "./SIngleTasks";

interface Props {
  column: column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  tasks: Tasks[];
}

const ColumnContainer = (props: Props) => {
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;
  const [isDropdown, setIsdropdown] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  const tasksId = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="min-w-[25rem] min-h-[20rem] rounded opacity-30 relative  border bg-gray-100/50"
      >
        <header
          {...attributes}
          {...listeners}
          className="border-b cursor-move p-2 flex justify-between items-center  capitalize font-semibold"
        >
          {column.title}

          <button onClick={() => setIsdropdown(!isDropdown)}>
            <CiMenuKebab />
          </button>
        </header>
        {isDropdown && (
          <div className="absolute bg-white  shadow-2xl rounded right-0 z-10 shadow-slate-200">
            <ul>
              <li
                onClick={() => deleteColumn(column.id)}
                className="cursor-pointer py-2 px-5 border-b text-sm text-slate-500"
              >
                Delete
              </li>
              <li className="cursor-pointer py-2 px-5 text-sm text-slate-500">
                Add Task
              </li>
            </ul>
          </div>
        )}
        <div className="p-4">
          {tasks.map((task) => (
            <SingleTask
              updateTask={updateTask}
              key={task.id}
              task={task}
              deleteTask={deleteTask}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`min-w-[25rem] min-h-[20rem] rounded relative  border bg-gray-100/50 
`}
    >
      <header
        {...attributes}
        {...listeners}
        className="border-b cursor-move p-2 flex justify-between items-center  capitalize font-semibold"
      >
        {editMode ? (
          <input
            className="w-full outline-none px-2"
            type="text"
            autoFocus
            value={column.title}
            onChange={(e) => updateColumn(column.id, e.target.value)}
            onBlur={() => setEditMode(false)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setEditMode(false);
            }}
          />
        ) : (
          <span onClick={() => setEditMode(true)}>{column.title}</span>
        )}

        <button onClick={() => setIsdropdown(!isDropdown)}>
          <CiMenuKebab />
        </button>
      </header>
      {isDropdown && (
        <div className="absolute bg-white  shadow-2xl rounded right-0 z-10 shadow-slate-200">
          <ul>
            <li
              onClick={() => deleteColumn(column.id)}
              className="cursor-pointer py-2 px-5 border-b text-sm text-slate-500"
            >
              Delete
            </li>
            <li
              onClick={() => createTask(column.id)}
              className="cursor-pointer py-2 px-5 text-sm text-slate-500"
            >
              Add Task
            </li>
          </ul>
        </div>
      )}
      <div className="p-4">
        <SortableContext items={tasksId}>
          {tasks.map((task) => (
            <SingleTask
              updateTask={updateTask}
              key={task.id}
              task={task}
              deleteTask={deleteTask}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
export default ColumnContainer;
