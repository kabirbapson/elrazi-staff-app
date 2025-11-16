import { http } from './config';

const loadUserSession = () => {
  if (typeof window === 'undefined') return {};

  try {
    const session = localStorage.getItem('session');
    return session ? JSON.parse(session) : {};
  } catch {
    return {};
  }
};

const getAuthHeader = () => {
  const session = loadUserSession();
  if (!session.token) {
    // If no token is found, return an empty header
    return {};
  }
  const token = session.token;
  return {
    headers: {
      Authorization: `Token ${token}`
    }
  };
};

/**
 * ───────────────────────────────────────────────────────────────
 * SUBJECT ENDPOINTS
 * ───────────────────────────────────────────────────────────────
 */

/**
 * List all subjects
 * GET /api/subjects/
 */
export const getAllSubjects = async () => {
  return http.get('/api/subjects/', {}, getAuthHeader());
};

/**
 * Retrieve one subject by ID
 * GET /api/subjects/{id}/
 */
export const getSubjectById = async (subjectId) => {
  return http.get(`/api/subjects/${subjectId}/`, {}, getAuthHeader());
};

/**
 * Create a new subject
 * POST /api/subjects/
 * Body: { subject_code, subject_title, credit_hours }
 */
export const createSubject = async (subjectData) => {
  // subjectData should be an object like:
  // { subject_code: 'ANAT101', subject_title: 'Anatomy', credit_hours: 4 }
  return http.post('/api/subjects/', subjectData, getAuthHeader());
};

/**
 * Update an existing subject
 * PUT /api/subjects/{id}/
 * Body: { subject_code, subject_title, credit_hours }
 */
export const updateSubject = async (subjectId, subjectData) => {
  return http.put(`/api/subjects/${subjectId}/`, subjectData, getAuthHeader());
};

/**
 * Delete a subject
 * DELETE /api/subjects/{id}/
 */
export const deleteSubject = async (subjectId) => {
  return http.delete(`/api/subjects/${subjectId}/`, {}, getAuthHeader());
};

/**
 * ───────────────────────────────────────────────────────────────
 * COURSE ENDPOINTS
 * ───────────────────────────────────────────────────────────────
 */

/**
 * List all courses
 * GET /api/courses/
 */
export const getAllCourses = async () => {
  return http.get('/api/courses/', {}, getAuthHeader());
};

/**
 * Retrieve one course by ID
 * GET /api/courses/{id}/
 */
export const getCourseById = async (courseId) => {
  return http.get(`/api/courses/${courseId}/`, {}, getAuthHeader());
};

/**
 * Create a new course
 * POST /api/courses/
 * Body: { faculty, name, description, duration_in_weeks, programme, subjects?: [] }
 */
export const createCourse = async (courseData) => {
  // courseData example:
  // {
  //   faculty: 3,
  //   name: 'Bachelor of Medicine and Surgery',
  //   description: '...',
  //   duration_in_weeks: 208,
  //   programme: 'MBBS',
  //   subjects: [1, 2, 3] // optional array of subject IDs
  // }
  return http.post('/api/courses/', courseData, getAuthHeader());
};

/**
 * Update an existing course
 * PUT /api/courses/{id}/
 * Body: { faculty, name, description, duration_in_weeks, programme, subjects?: [] }
 */
export const updateCourse = async (courseId, courseData) => {
  return http.put(`/api/courses/${courseId}/`, courseData, getAuthHeader());
};

/**
 * Delete a course
 * DELETE /api/courses/{id}/
 */
export const deleteCourse = async (courseId) => {
  return http.delete(`/api/courses/${courseId}/`, {}, getAuthHeader());
};

/**
 * ───────────────────────────────────────────────────────────────
 * COURSE ⇄ SUBJECT RELATIONSHIP
 * ───────────────────────────────────────────────────────────────
 */

/**
 * Add a subject to a course
 * POST /api/courses/{courseId}/add-subject/{subjectId}/
 */
export const addSubjectToCourse = async (courseId, subjectId) => {
  return http.post(`/api/courses/${courseId}/add-subject/${subjectId}/`, {}, getAuthHeader());
};

/**
 * Remove a subject from a course
 * POST /api/courses/{courseId}/remove-subject/{subjectId}/
 */
export const removeSubjectFromCourse = async (courseId, subjectId) => {
  return http.post(`/api/courses/${courseId}/remove-subject/${subjectId}/`, {}, getAuthHeader());
};
