import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from './Column';
import './styles.css';

function App() {
    const [columns, setColumns] = useState(() => {
        const savedColumns = localStorage.getItem('columns');
        return savedColumns ? JSON.parse(savedColumns) : {
            todo: {
                name: 'To Do',
                items: [{ id: '1', content: 'Task 1', color: '#FFCDD2' }, { id: '2', content: 'Task 2', color: '#BBDEFB' }],
            },
            ongoing: {
                name: 'Ongoing',
                items: [],
            },
            completed: {
                name: 'Completed',
                items: [],
            },
        };
    });

    const colors = ['#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9', '#BBDEFB', '#B3E5FC', '#B2EBF2', '#B2DFDB', '#C8E6C9', '#DCEDC8', '#F0F4C3', '#FFF9C4'];

    // Save columns to local storage when columns state changes
    useEffect(() => {
        localStorage.setItem('columns', JSON.stringify(columns));
    }, [columns]);

    const moveTask = (taskId, sourceColumnId, destinationColumnId, destinationIndex) => {
        const sourceColumn = columns[sourceColumnId];
        const destColumn = columns[destinationColumnId];

        const taskToMove = sourceColumn.items.find((item) => item.id === taskId);
        const updatedSourceItems = sourceColumn.items.filter((item) => item.id !== taskId);

        if (sourceColumnId === destinationColumnId) {
            const reorderedItems = [...updatedSourceItems];
            reorderedItems.splice(destinationIndex, 0, taskToMove);
            setColumns((prevColumns) => ({
                ...prevColumns,
                [sourceColumnId]: {
                    ...sourceColumn,
                    items: reorderedItems,
                },
            }));
        } else {
            const updatedDestItems = [...destColumn.items, taskToMove];
            setColumns((prevColumns) => ({
                ...prevColumns,
                [sourceColumnId]: {
                    ...sourceColumn,
                    items: updatedSourceItems,
                },
                [destinationColumnId]: {
                    ...destColumn,
                    items: updatedDestItems,
                },
            }));
        }
    };

    const addTask = (columnId) => {
        const taskContent = prompt("Enter task content:");
        if (taskContent) {
            const colorIndex = Math.floor(Math.random() * colors.length);  // Pick a random color
            const newTask = { id: Date.now().toString(), content: taskContent, color: colors[colorIndex] };
            setColumns((prevColumns) => {
                const updatedColumn = {
                    ...prevColumns[columnId],
                    items: [...prevColumns[columnId].items, newTask],
                };
                return { ...prevColumns, [columnId]: updatedColumn };
            });
        }
    };

    const addColumn = () => {
        const columnName = prompt("Enter new column name:");
        if (columnName) {
            const newColumnId = `column_${Date.now()}`;
            setColumns((prevColumns) => ({
                ...prevColumns,
                [newColumnId]: { name: columnName, items: [] },
            }));
        }
    };

    const deleteColumn = (columnId) => {
        setColumns((prevColumns) => {
            const newColumns = { ...prevColumns };
            delete newColumns[columnId];
            return newColumns;
        });
    };

    const deleteTask = (columnId, taskId) => {
        setColumns((prevColumns) => {
            const updatedColumn = {
                ...prevColumns[columnId],
                items: prevColumns[columnId].items.filter((task) => task.id !== taskId),
            };
            return { ...prevColumns, [columnId]: updatedColumn };
        });
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="App">
                {/* Video Background */}
                <video id="video-background" autoPlay loop muted>
    <source src="./bg.mp4" type="video/mp4" />
    Your browser does not support the video tag.
</video>


                <h1>Pixy Board</h1>
                <button onClick={addColumn}>Add Column</button>

                <div className="kanban-board-wrapper">
                    <div className="kanban-board">
                        {Object.entries(columns).map(([columnId, column]) => (
                            <Column 
                                key={columnId} 
                                columnId={columnId} 
                                column={column} 
                                moveTask={moveTask} 
                                addTask={addTask} 
                                deleteColumn={deleteColumn} 
                                deleteTask={deleteTask} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}

export default App;
