import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [members, setMembers] = useState([])
  const [projects, setProjects] = useState([])
  const [memberName, setMemberName] = useState('')
  const [projectName, setProjectName] = useState('')
  const [projectCount, setProjectCount] = useState(1)
  const [results, setResults] = useState(null)

  const addMember = (e) => {
    e.preventDefault()
    if (!memberName.trim()) return
    setMembers([...members, memberName.trim()])
    setMemberName('')
  }

  const removeMember = (index) => {
    setMembers(members.filter((_, i) => i !== index))
  }

  const addProject = (e) => {
    e.preventDefault()
    if (!projectName.trim()) return
    setProjects([...projects, { name: projectName.trim(), count: parseInt(projectCount) || 1 }])
    setProjectName('')
    setProjectCount(1)
  }

  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index))
  }

  const handleRandomize = () => {

    let slots = []
    projects.forEach(p => {
      for (let i = 0; i < p.count; i++) {
        slots.push(p.name)
      }
    })


    const shuffleArray = (arr) => {
      const array = [...arr]
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
          ;[array[i], array[j]] = [array[j], array[i]]
      }
      return array
    }

    const shuffledMembers = shuffleArray(members)


    const newResults = {}
    const unassigned = []


    projects.forEach(p => {
      newResults[p.name] = []
    })

    shuffledMembers.forEach((member, index) => {
      if (index < slots.length) {
        const project = slots[index]
        if (!newResults[project]) newResults[project] = []
        newResults[project].push(member)
      } else {
        unassigned.push(member)
      }
    })


    setResults({ assignments: newResults, unassigned })
  }

  return (
    <div className="container">
      <header>
        <h1>Team Matcher</h1>
        <p>Randomly assign members to projects</p>
      </header>

      <div className="main-content">
        <div className="input-section">
          <div className="card">
            <h2>Members ({members.length})</h2>
            <form onSubmit={addMember} className="input-group">
              <input
                type="text"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="Enter name"
              />
              <button type="submit">Add</button>
            </form>
            <ul className="list">
              {members.map((m, i) => (
                <li key={i}>
                  {m}
                  <button onClick={() => removeMember(i)} className="delete-btn">×</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2>Projects / Jobs</h2>
            <form onSubmit={addProject} className="input-group project-form">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Job name"
              />
              <input
                type="number"
                min="1"
                value={projectCount}
                onChange={(e) => setProjectCount(e.target.value)}
                placeholder="Qty"
                className="qty-input"
              />
              <button type="submit">Add</button>
            </form>
            <ul className="list">
              {projects.map((p, i) => (
                <li key={i}>
                  <span>{p.name} <small>({p.count})</small></span>
                  <button onClick={() => removeProject(i)} className="delete-btn">×</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="action-section">
          <button onClick={handleRandomize} className="primary-btn" disabled={members.length === 0 || projects.length === 0}>
            Match Teams
          </button>
        </div>

        {results && (
          <div className="results-section">
            <h2>Results</h2>
            <div className="results-grid">
              {Object.entries(results.assignments).map(([project, team]) => (
                <div key={project} className="result-card">
                  <h3>{project}</h3>
                  <ul>
                    {team.map((m, i) => <li key={i}>{m}</li>)}
                    {team.length === 0 && <li className="empty">No members</li>}
                  </ul>
                </div>
              ))}
              {results.unassigned.length > 0 && (
                <div className="result-card unassigned">
                  <h3>Unassigned</h3>
                  <ul>
                    {results.unassigned.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
