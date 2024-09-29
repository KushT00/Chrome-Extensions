import React from 'react';
import { useDrop } from 'react-dnd';
import Task from './Task';
import { BsFillTrashFill, BsPlusCircle } from 'react-icons/bs'; // Import React Icons

const Column = ({ columnId, column, moveTask, addTask, deleteColumn, deleteTask }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => {
      const destinationIndex = column.items.length; 
      moveTask(item.id, item.sourceColumnId, columnId, destinationIndex);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className="column"
      style={{ backgroundColor: isOver ? 'lightgreen' : '' }}
    >
      <h2>
        {column.name}
        <span 
          className="icon" 
          onClick={() => deleteColumn(columnId)}
          role="img" 
          aria-label="trash"
        >
          <BsFillTrashFill style={{ fontSize: '15px' }} /> {/* Smaller icon */}
        </span>
        <span 
          className="icon" 
          onClick={() => addTask(columnId)}
          role="img" 
          aria-label="add"
          style={{ marginLeft: '5px', cursor: 'pointer' }}
        >
          <BsPlusCircle style={{ fontSize: '18px' }} /> {/* Smaller icon */}
        </span>
      </h2>
      {column.items.map((task, index) => (
        <Task key={task.id} task={task} columnId={columnId} index={index} deleteTask={deleteTask} />
      ))}
    </div>
  );
};

export default Column;
