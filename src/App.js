import React, { useState } from "react"
import "./App.scss"

const description = `
We need a to-do list to track the progress of our tasks and we created a
static version. However, the items cannot be reordered or updated, which 
bothers us a lot.

Could you help refine this to-do list. The detailed action items are 
listed within the list itself. Thank you very much!
`

const taskList = [
  "Each item should have an index number",
  "The item under the cursor should be highlighted",
  "After click an item, it should be flipped to its backside, in which the detailed descriptions (randomly generated) are shown",
  "The order of items can be arranged by drag & drop",
  "The index number should be maintained during reordering",
  "Each item is in one of the following state, indicated with font color",
  "Drag an item and drop it to the following state block will change its state",
  "Show a count number besides the following blocks"
]

const Item = ({ task, setdraggingIndex, myDragEnter, startDragging }) => {
  const { content, status, index } = task

  const [displayContent, setDisplayContent] = useState(`${index}. ${content}`)
  const [displayStatus, setDisplayStatus] = useState("index")

  return (
    <div
      id={index}
      key={index}
      className="item"
      draggable="true"
      onClick={() => {
        if (displayStatus === "index") {
          setDisplayContent(`${status}: ${content}`)
          setDisplayStatus("status")
        } else {
          setDisplayContent(`${index}. ${content}`)
          setDisplayStatus("index")
        }
      }}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", event.target.id)
        startDragging(task)
      }}
      onDrag={(event) => {
        event.target.style.opacity = 0
      }}
      onDragEnd={(event) => {
        event.preventDefault()
        event.target.style.opacity = 1
        setdraggingIndex(-1)
      }}
      onDragEnter={(event) => {
        event.preventDefault()
        myDragEnter(task)
      }}
      style={{
        fontStyle: "italic",
        color:
          status === "Finished"
            ? "#87cd02"
            : status === "Working"
            ? "#7abfe1"
            : status === "Cancelled"
            ? "#c9caca"
            : "#9ba56b",
        textDecoration:
          (status === "Finished" || status === "Cancelled") && "line-through"
      }}
    >
      {displayContent}
    </div>
  )
}

const DropActionZone = ({ status, setTasks, count }) => {
  return (
    <div
      onDrop={(event) => {
        event.preventDefault()
        event.target.style.backgroundColor = "#fff"
        const index = parseInt(event.dataTransfer.getData("text/plain"))
        setTasks((tasks) => {
          let updatedTask = tasks.find((task) => {
            return task.index === index
          })
          const realIndex = tasks.indexOf(updatedTask)
          updatedTask.status = status
          const newTasks = [...tasks]
          newTasks.splice(realIndex, 1, updatedTask)
          return newTasks
        })
      }}
      onDragOver={(event) => {
        event.preventDefault()
      }}
      onDragEnter={(event) => {
        event.target.style.backgroundColor = "#acacac"
      }}
      onDragLeave={(event) => {
        event.target.style.backgroundColor = "#fff"
      }}
    >
      {status} ({count})
    </div>
  )
}

const ItemCollection = ({ tasks, setTasks }) => {
  const count = tasks.reduce(
    (acc, cur, index) => {
      const key = cur.status.toLowerCase()
      const prevCount = acc[key]
      return {
        ...acc,
        [key]: prevCount + 1
      }
    },
    { finished: 0, working: 0, preparing: 0, cancelled: 0 }
  )

  const [draggingIndex, setdraggingIndex] = useState(-1)

  return (
    <div className="collection">
      <div className="item-list">
        {tasks.map((task) => (
          <Item
            key={task.content}
            task={task}
            setdraggingIndex={setdraggingIndex}
            startDragging={(task) => {
              const realIndex = tasks.indexOf(task)
              setdraggingIndex(realIndex)
            }}
            myDragEnter={(task) => {
              const targetIndex = tasks.indexOf(task)
              if (draggingIndex == targetIndex) return
              let tmp = tasks[draggingIndex]
              tasks[draggingIndex] = tasks[targetIndex]
              tasks[targetIndex] = tmp
              setdraggingIndex(targetIndex)
              setTasks(tasks)
            }}
          />
        ))}
      </div>
      <div className="drop-action-zone">
        <DropActionZone
          status="Finished"
          setTasks={setTasks}
          count={count["finished"]}
        />
        <DropActionZone
          status="Working"
          setTasks={setTasks}
          count={count["working"]}
        />
        <DropActionZone
          status="Preparing"
          setTasks={setTasks}
          count={count["preparing"]}
        />
        <DropActionZone
          status="Cancelled"
          setTasks={setTasks}
          count={count["cancelled"]}
        />
      </div>
    </div>
  )
}

const App = () => {
  const [tasks, setTasks] = useState(
    taskList.map((task, index) => {
      return {
        content: task,
        status: "Preparing",
        index: index + 1
      }
    })
  )

  return (
    <div id="container">
      <div className="description">
        <div>{description}</div>
      </div>
      <ItemCollection tasks={tasks} setTasks={setTasks} />
      <div className="preview">
        <div className="preview-title">Sample result</div>
        <img
          src="https://media.giphy.com/media/24m649DLWjmspI75ZY/giphy.gif"
          alt="Preview Expected result"
        />
      </div>
    </div>
  )
}

export default App
