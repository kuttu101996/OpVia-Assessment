import React from 'react'
import { Routes, Route } from 'react-router-dom'
import StudentList from './StudentList'
import StudentForm from './StudentForm'
import Analytics from './Analytics'

const Dashboard: React.FC = () => {

  return (
    <div className="space-y-3">
      <div className="card px-4 py-4 min-h-[500px]">
        <Routes>
          <Route path="/" element={<StudentList />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/add-student" element={<StudentForm />} />
          <Route path="/edit-student/:id" element={<StudentForm />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </div>
  )
}

export default Dashboard
