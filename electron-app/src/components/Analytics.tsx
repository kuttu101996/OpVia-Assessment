import React from 'react'
import { useAnalytics } from '../hooks/useApi'

const Analytics: React.FC = () => {
  const { analytics, loading, error } = useAnalytics();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="loading-spinner"></div>
        <p className="mt-4 text-gray-600">Loading analytics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">No analytics data available.</p>
      </div>
    )
  }

  const getGradeColorClasses = (grade: number) => {
    if (grade >= 90) return 'bg-green-500'
    if (grade >= 80) return 'bg-blue-500'
    if (grade >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getSubjectColorClasses = (subject: string) => {
    const colors = {
      Math: 'bg-blue-100 text-blue-800',
      Science: 'bg-green-100 text-green-800',
      English: 'bg-orange-100 text-orange-800',
      History: 'bg-purple-100 text-purple-800'
    }
    return colors[subject as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Dashboard Analytics</h2>
        <p className="text-gray-600 mt-2">Overview of student performance and statistics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Students Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="text-3xl mr-4">👥</div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">Total Students</h3>
              <div className="text-3xl font-bold text-primary-600">{analytics.totalStudents}</div>
            </div>
          </div>
        </div>

        {/* Average Grades by Subject */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700">Average Grades by Subject</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(analytics.averageGradeBySubject).map(([subject, average]) => (
              <div key={subject} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{subject}</span>
                  <span className="text-sm font-semibold text-gray-900">{average.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getGradeColorClasses(average)}`}
                    style={{ width: `${average}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Additions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700">Recent Additions</h3>
            <span className="text-sm text-gray-500">Last 10 students added</span>
          </div>
          <div className="space-y-3">
            {analytics.recentAdditions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent additions</p>
            ) : (
              analytics.recentAdditions.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSubjectColorClasses(student.subject)}`}>
                          {student.subject}
                        </span>
                        <span className="text-sm text-gray-600">{student.grade}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {student.created_at 
                      ? new Date(student.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })
                      : 'N/A'
                    }
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700">Performance Summary</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(analytics.averageGradeBySubject).length > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Highest Average:</span>
                  <span className="font-semibold text-gray-900">
                    {Object.entries(analytics.averageGradeBySubject)
                      .reduce((max, [subject, avg]) => avg > max.avg ? { subject, avg } : max, 
                              { subject: '', avg: 0 })
                      .subject} ({Object.entries(analytics.averageGradeBySubject)
                      .reduce((max, [, avg]) => Math.max(max, avg), 0).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lowest Average:</span>
                  <span className="font-semibold text-gray-900">
                    {Object.entries(analytics.averageGradeBySubject)
                      .reduce((min, [subject, avg]) => avg < min.avg ? { subject, avg } : min, 
                              { subject: '', avg: 100 })
                      .subject} ({Object.entries(analytics.averageGradeBySubject)
                      .reduce((min, [, avg]) => Math.min(min, avg), 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Overall Average:</span>
                  <span className="font-semibold text-gray-900">
                    {(Object.values(analytics.averageGradeBySubject)
                      .reduce((sum, avg) => sum + avg, 0) / 
                      Object.values(analytics.averageGradeBySubject).length).toFixed(1)}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
};

export default Analytics;
