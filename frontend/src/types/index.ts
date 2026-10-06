// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// Auth types
export interface UserInfo {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profileImageUrl?: string;
  roles: string[];
  permissions: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserInfo;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Student types
export interface StudentSummary {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentName?: string;
  courseName?: string;
  currentSemester?: number;
  section?: string;
  status: string;
}

export interface Student {
  id: number;
  studentId: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImageUrl?: string;
  departmentId?: number;
  departmentName?: string;
  departmentCode?: string;
  courseId?: number;
  courseName?: string;
  currentSemester?: number;
  section?: string;
  admissionDate?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

// Professor types
export interface ProfessorSummary {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentName?: string;
  designation?: string;
  status: string;
}

export interface Professor {
  id: number;
  employeeId: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId?: number;
  departmentName?: string;
  designation?: string;
  qualification?: string;
  specialization?: string;
  experienceYears?: number;
  dateOfBirth?: string;
  gender?: string;
  joiningDate?: string;
  address?: string;
  status: string;
  createdAt: string;
}

// Department types
export interface DepartmentSummary {
  id: number;
  code: string;
  name: string;
  active: boolean;
}

export interface Department {
  id: number;
  code: string;
  name: string;
  description?: string;
  hodId?: number;
  hodName?: string;
  establishedDate?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Course types
export interface Course {
  id: number;
  code: string;
  name: string;
  description?: string;
  departmentId: number;
  departmentName?: string;
  durationYears: number;
  totalSemesters: number;
  active: boolean;
  createdAt: string;
}

// Notice types
export interface Notice {
  id: number;
  title: string;
  content: string;
  noticeType: string;
  targetAudience: string;
  priority: string;
  isPublished: boolean;
  publishedAt?: string;
  validUntil?: string;
  createdAt: string;
}

// Notification types
export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  notificationType: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

// Dashboard stats
export interface DashboardStats {
  totalStudents: number;
  totalProfessors: number;
  totalDepartments: number;
  totalCourses: number;
  attendancePercentage?: number;
  pendingLeaveRequests?: number;
  upcomingExams?: number;
  unpaidFees?: number;
}

// Leave types
export interface LeaveRequest {
  id: number;
  applicantUserId: number;
  applicantName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: string;
  appliedAt: string;
  approvedBy?: number;
  approvedByName?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

// Attendance types
export interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  studentCode: string;
  subjectId: number;
  subjectName: string;
  attendanceDate: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
}

// Fee types
export interface StudentFee {
  id: number;
  studentId: number;
  studentName: string;
  studentCode: string;
  totalAmount: number;
  paidAmount: number;
  discountAmount: number;
  dueDate?: string;
  status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE';
}

// Library types
export interface Book {
  id: number;
  isbn?: string;
  title: string;
  author: string;
  publisher?: string;
  category?: string;
  publicationYear?: number;
  totalCopies: number;
  availableCopies: number;
  rackNumber?: string;
}

// Pagination params
export interface PaginationParams {
  page?: number;
  size?: number;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
