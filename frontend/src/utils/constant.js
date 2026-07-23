const API_BASE_URL = import.meta.env.VITE_API_URL;

export const USER_API_END_POINT = `${API_BASE_URL}/user`;

export const JOB_API_END_POINT = `${API_BASE_URL}/job`;

export const APPLICATION_API_END_POINT = `${API_BASE_URL}/application`;

export const COMPANY_API_END_POINT = `${API_BASE_URL}/company`;

// 🔧 FIXED: this was missing, which caused
// "does not provide an export named 'NOTIFICATION_API_END_POINT'"
export const NOTIFICATION_API_END_POINT = `${API_BASE_URL}/notification`;
