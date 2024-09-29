import React from 'react';
import { useDrag } from 'react-dnd';
import { BsFillTrashFill } from 'react-icons/bs';

const Task = ({ task, columnId, index, deleteTask }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, sourceColumnId: columnId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="task"
      style={{
        backgroundColor: task.color,  // Apply the task's color
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
    >
      <div 
        style={{
          display: 'flex',             // Use flexbox to arrange content
          justifyContent: 'space-between', // Space between task content and icon
          alignItems: 'center'         // Vertically center the content and icon
        }}
      >
        <span>{task.content}</span> {/* Task content aligned to the start */}
        <span 
          className="icon" 
          onClick={() => deleteTask(columnId, task.id)}
          role="img" 
          aria-label="trash"
          style={{ cursor: 'pointer', marginLeft: '10px' }}  // Margin to separate icon from content
        >
          <BsFillTrashFill style={{ fontSize: '12px' }} /> {/* Delete icon aligned to the end */}
        </span>
      </div>
    </div>
  );
};

export default Task;
