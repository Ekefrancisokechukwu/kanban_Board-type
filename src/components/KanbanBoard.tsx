import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { Id, Tasks, column } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  DragOverEvent,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import SingleTask from "./SIngleTasks";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<column[]>([]);
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [activeColumn, setActiveColumn] = useState<column | null>();
  const [activeTask, setActiveTask] = useState<Tasks | null>();

  const columId = useMemo(() => columns.map((col) => col.id), [columns]);

  const updateTask = (id: Id, content: string) => {
    const newTask = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTask);
  };

  const deleteTask = (id: Id) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
  };

  const createTask = (columnId: Id) => {
    const newTask: Tasks = {
      id: Math.floor(Math.random() * 1000),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  };

  const updateColumn = (id: Id, title: string) => {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumns);
  };

  const createColumn = () => {
    const columnToAdd: column = {
      id: Math.floor(Math.random() * 1000),
      title: ` Columns ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  };

  const deleteColumn = (id: Id) => {
    setColumns((col) => col.filter((col) => col.id !== id));

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  };

  const ondragStart = (ev: DragStartEvent) => {
    if (ev.active.data.current?.type === "column") {
      setActiveColumn(ev.active.data.current.column);
      return;
    }

    if (ev.active.data.current?.type === "task") {
      setActiveTask(ev.active.data.current.column);
      return;
    }
  };

  const ondragEnd = (ev: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = ev;
    if (!over) return;

    const activeColumId = active.id;
    const overColumnId = over.id;

    if (activeColumId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumId
      );

      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };

  const ondragOver = (ev: DragOverEvent) => {
    const { active, over } = ev;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "task";
    const isOverTask = over.data.current?.type === "task";
    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
    const isOverColumn = over.data.current?.type === "column";

    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={ondragStart}
      onDragEnd={ondragEnd}
      onDragOver={ondragOver}
    >
      <div>
        <div className="p-4 px-10 flex justify-between border-b">
          <h1 className="text-gray-600 font-semibold text-2xl">
            Kanban <span className="text-green-600">Board</span>
          </h1>
          <button
            onClick={() => createColumn()}
            className="bg-gradient-to-bl addbtn ms-auto shadow-lg from-green-600 to-green-800 h-9 w-9 rounded-md text-white grid place-items-center text-3xl"
          >
            <AiOutlinePlus />
          </button>
        </div>
        <div className="flex items-start  mx-auto overflow-x-scroll max-w-[2020px] py-10 px-6  gap-8">
          {columns.length === 0 ? (
            <div className="h-[45vh] grid place-items-center w-full">
              <h1 className="text-slate-500  text-2xl">No activities yet</h1>
            </div>
          ) : (
            <SortableContext items={columId}>
              {columns.map((column) => (
                <ColumnContainer
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                  createTask={createTask}
                  key={column.id}
                  column={column}
                  updateColumn={updateColumn}
                  deleteColumn={deleteColumn}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                />
              ))}
            </SortableContext>
          )}
        </div>
      </div>

      {createPortal(
        <DragOverlay>
          {activeColumn && (
            <ColumnContainer
              updateTask={updateTask}
              createTask={createTask}
              deleteColumn={deleteColumn}
              column={activeColumn}
              updateColumn={updateColumn}
              tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
              deleteTask={deleteTask}
            />
          )}
          {activeTask && (
            <SingleTask
              task={activeTask}
              // task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
export default KanbanBoard;
