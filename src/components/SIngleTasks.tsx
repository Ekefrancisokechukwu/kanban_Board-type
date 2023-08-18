import { useState } from "react";
import { Tasks, Id } from "../types";
import { HiOutlineTrash } from "react-icons/hi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Tasks;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

const SingleTask = ({ task, deleteTask, updateTask }: Props) => {
  const [editMode, setEditMode] = useState<boolean>(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  if (editMode) {
    return (
      <article
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className=" text-gray-600  text-lg group border relative overflow-y-scroll bg-white rounded-md mb-3 min-h-[4rem] h-[5rem]"
      >
        <textarea
          onChange={(e) => updateTask(task.id, e.target.value)}
          onBlur={toggleEditMode}
          value={task.content}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
          className="p-2 resize-none outline-pink-400 rounded-md w-full h-full"
        ></textarea>

        <button
          onClick={() => deleteTask(task.id)}
          title="Delete task"
          className="absolute invisible group-hover:visible right-4 text-lg text-gray-600 top-1/2 -translate-y-1/2"
        >
          <HiOutlineTrash />
        </button>
      </article>
    );
  }

  if (isDragging) {
    return (
      <div className="p-2  opacity-40 text-gray-600 first-letter:capitalize text-lg   group border border-pink-400 relative overflow-y-scroll bg-white rounded-md mb-3 min-h-[4rem] h-[5rem]"></div>
    );
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => setEditMode(true)}
      className="p-2 cursor-grab text-gray-600 first-letter:capitalize text-lg hover:outline-dotted outline-green-600 group border relative overflow-y-scroll bg-white rounded-md mb-3 min-h-[4rem] h-[5rem]"
    >
      <p className="whitespace-pre-wrap">{task.content}</p>

      <button
        onClick={() => deleteTask(task.id)}
        title="Delete task"
        className="absolute invisible group-hover:visible right-4 text-lg text-gray-600 top-1/2 -translate-y-1/2"
      >
        <HiOutlineTrash />
      </button>
    </article>
  );
};
export default SingleTask;
