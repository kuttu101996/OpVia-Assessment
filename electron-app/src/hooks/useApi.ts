import { useState, useEffect, useCallback } from 'react';
import { Student, Analytics } from '../types';
import { studentsApi, analyticsApi } from '../services/api';

// Custom hook for students API
export const useStudents = (subject?: string) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentsApi.getAll(subject);
      if (response.success && response.data) {
        setStudents(response.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [subject]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const createStudent = async (student: Omit<Student, 'id' | 'created_at'>) => {
    try {
      const response = await studentsApi.create(student);
      if (response.success) {
        await fetchStudents(); // Refresh list
        return response.data;
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const updateStudent = async (id: number, student: Partial<Omit<Student, 'id' | 'created_at'>>) => {
    try {
      const response = await studentsApi.update(id, student);
      if (response.success) {
        await fetchStudents(); // Refresh list
        return response.data;
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const deleteStudent = async (id: number) => {
    try {
      const response = await studentsApi.delete(id);
      if (response.success) {
        await fetchStudents(); // Refresh list
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return {
    students,
    loading,
    error,
    refetch: fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent
  };
};

// Custom hook for analytics API
export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsApi.get();
      if (response.success && response.data) {
        setAnalytics(response.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  };
};
