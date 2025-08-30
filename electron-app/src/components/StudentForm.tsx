import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate, useParams } from 'react-router-dom'
import { useStudents } from '../hooks/useApi'
import { useActiveTab } from '../contexts/ActiveTabContext'

interface StudentFormData {
  name: string;
  email: string;
  subject: 'Math' | 'Science' | 'English' | 'History';
  grade: number;
}

const studentSchema = yup.object({
  name: yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup.string()
    .required('Email is required')
    .email('Must be a valid email'),
  subject: yup.string()
    .required('Subject is required')
    .oneOf(['Math', 'Science', 'English', 'History'], 'Subject must be one of: Math, Science, English, History'),
  grade: yup.number()
    .required('Grade is required')
    .min(0, 'Grade must be between 0 and 100')
    .max(100, 'Grade must be between 0 and 100')
    .integer('Grade must be a whole number')
}) as yup.ObjectSchema<StudentFormData>;

const StudentForm: React.FC = () => {
  const { setActiveTab } = useActiveTab()
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const { students, createStudent, updateStudent } = useStudents();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<StudentFormData>({
    resolver: yupResolver(studentSchema)
  });

  useEffect(() => {
    setActiveTab('add-student')
  }, [])

  // Load student data for editing
  useEffect(() => {
    if (isEditing && id && students.length > 0) {
      const student = students.find(s => s.id === parseInt(id));
      if (student) {
        setValue('name', student.name);
        setValue('email', student.email);
        setValue('subject', student.subject);
        setValue('grade', student.grade);
      }
    }
  }, [isEditing, id, students, setValue]);

  const onSubmit = async (data: StudentFormData) => {
    try {
      setIsLoading(true);
      setSubmitError(null);

      if (isEditing && id)
        await updateStudent(parseInt(id), data);
      else await createStudent(data);

      navigate('/dashboard/students');
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to save student');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/students');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 h-[calc(90vh-100px)] flex flex-col items-center justify-center">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">
          {isEditing ? 'Edit Student' : 'Add New Student'}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={`input ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter student's full name"
            />
            {errors.name && (
              <span className="text-sm text-red-600">{errors.name.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`input ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter student's email"
            />
            {errors.email && (
              <span className="text-sm text-red-600">{errors.email.message}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Subject *
            </label>
            <select
              {...register('subject')}
              className={`input ${errors.subject ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            >
              <option value="">Select a subject</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="History">History</option>
            </select>
            {errors.subject && (
              <span className="text-sm text-red-600">{errors.subject.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
              Grade (0-100) *
            </label>
            <input
              id="grade"
              type="number"
              min="0"
              max="100"
              {...register('grade')}
              className={`input ${errors.grade ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter grade (0-100)"
            />
            {errors.grade && (
              <span className="text-sm text-red-600">{errors.grade.message}</span>
            )}
          </div>
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {submitError}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading
              ? (isEditing ? 'Updating...' : 'Creating...')
              : (isEditing ? 'Update Student' : 'Create Student')
            }
          </button>
        </div>
      </form>
    </div>
  )
};

export default StudentForm;
