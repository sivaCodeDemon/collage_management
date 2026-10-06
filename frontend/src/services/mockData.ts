import { 
  Student, 
  StudentSummary, 
  Professor, 
  Department, 
  Course, 
  Notice, 
  LeaveRequest, 
  AttendanceRecord, 
  StudentFee, 
  Book, 
  DashboardStats,
  UserInfo
} from '@/types';

export const MOCK_USERS: Record<string, UserInfo & { passwordHash: string; token: string }> = {
  'superadmin@college.edu': {
    id: 1,
    email: 'superadmin@college.edu',
    firstName: 'Alexander',
    lastName: 'Vance',
    fullName: 'Alexander Vance',
    roles: ['SUPER_ADMIN'],
    permissions: ['ALL'],
    passwordHash: 'Admin@123',
    token: 'mock-jwt-token-superadmin'
  },
  'principal@college.edu': {
    id: 2,
    email: 'principal@college.edu',
    firstName: 'Dr. Rajesh',
    lastName: 'Kumar',
    fullName: 'Dr. Rajesh Kumar',
    roles: ['PRINCIPAL'],
    permissions: ['VIEW_ALL', 'APPROVE_LEAVE', 'PUBLISH_RESULTS'],
    passwordHash: 'Admin@123',
    token: 'mock-jwt-token-principal'
  },
  'hod.cse@college.edu': {
    id: 3,
    email: 'hod.cse@college.edu',
    firstName: 'Dr. Ananya',
    lastName: 'Sharma',
    fullName: 'Dr. Ananya Sharma',
    roles: ['HOD', 'PROFESSOR'],
    permissions: ['DEPT_MANAGE', 'ATTENDANCE_MARK', 'GRADE_ASSIGN'],
    passwordHash: 'Admin@123',
    token: 'mock-jwt-token-hod'
  },
  'prof.vikram@college.edu': {
    id: 4,
    email: 'prof.vikram@college.edu',
    firstName: 'Prof. Vikram',
    lastName: 'Mehta',
    fullName: 'Prof. Vikram Mehta',
    roles: ['PROFESSOR'],
    permissions: ['ATTENDANCE_MARK', 'EXAM_CREATE', 'ASSIGNMENT_GRADE'],
    passwordHash: 'Admin@123',
    token: 'mock-jwt-token-professor'
  },
  'student.arjun@college.edu': {
    id: 5,
    email: 'student.arjun@college.edu',
    firstName: 'Arjun',
    lastName: 'Kapoor',
    fullName: 'Arjun Kapoor',
    roles: ['STUDENT'],
    permissions: ['VIEW_SELF', 'SUBMIT_ASSIGNMENT', 'PAY_FEES'],
    passwordHash: 'Admin@123',
    token: 'mock-jwt-token-student'
  },
  'accountant@college.edu': {
    id: 6,
    email: 'accountant@college.edu',
    firstName: 'Ramesh',
    lastName: 'Gupta',
    fullName: 'Ramesh Gupta',
    roles: ['ACCOUNTANT'],
    permissions: ['FEE_MANAGE', 'PAYMENT_RECORD'],
    passwordHash: 'Admin@123',
    token: 'mock-jwt-token-accountant'
  }
};

export const MOCK_DEPARTMENTS: Department[] = [
  {
    id: 1,
    code: 'CSE',
    name: 'Computer Science & Engineering',
    description: 'Focuses on computing algorithms, software engineering, AI/ML, and cloud systems.',
    hodId: 3,
    hodName: 'Dr. Ananya Sharma',
    establishedDate: '1998-08-15',
    active: true,
    createdAt: '2020-01-01T00:00:00Z'
  },
  {
    id: 2,
    code: 'ECE',
    name: 'Electronics & Communication',
    description: 'Embedded systems, VLSI, wireless telecommunications, and robotics.',
    hodId: 7,
    hodName: 'Dr. Srinivas Rao',
    establishedDate: '2001-07-20',
    active: true,
    createdAt: '2020-01-01T00:00:00Z'
  },
  {
    id: 3,
    code: 'MECH',
    name: 'Mechanical Engineering',
    description: 'Thermodynamics, CAD/CAM, automotive systems, and advanced manufacturing.',
    hodId: 8,
    hodName: 'Dr. Prakash Deshmukh',
    establishedDate: '1995-06-10',
    active: true,
    createdAt: '2020-01-01T00:00:00Z'
  },
  {
    id: 4,
    code: 'CIVIL',
    name: 'Civil & Environmental Engineering',
    description: 'Structural engineering, geo-informatics, green building architecture.',
    hodId: 9,
    hodName: 'Dr. Meera Iyer',
    establishedDate: '1995-06-10',
    active: true,
    createdAt: '2020-01-01T00:00:00Z'
  },
  {
    id: 5,
    code: 'MGMT',
    name: 'School of Management Studies',
    description: 'Business administration, financial analytics, marketing, and entrepreneurship.',
    hodId: 10,
    hodName: 'Dr. Arvind Nambiar',
    establishedDate: '2005-08-01',
    active: true,
    createdAt: '2020-01-01T00:00:00Z'
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: 1,
    code: 'BTECH-CSE',
    name: 'B.Tech in Computer Science & Engineering',
    description: '4-Year undergraduate engineering program',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    durationYears: 4,
    totalSemesters: 8,
    active: true,
    createdAt: '2020-01-01T00:00:00Z'
  },
  {
    id: 2,
    code: 'BTECH-AI',
    name: 'B.Tech in Artificial Intelligence & Data Science',
    description: 'Undergraduate specialized computing track',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    durationYears: 4,
    totalSemesters: 8,
    active: true,
    createdAt: '2021-01-01T00:00:00Z'
  },
  {
    id: 3,
    code: 'BTECH-ECE',
    name: 'B.Tech in Electronics & Communication',
    description: '4-Year undergraduate program in electronics and embedded systems',
    departmentId: 2,
    departmentName: 'Electronics & Communication',
    durationYears: 4,
    totalSemesters: 8,
    active: true,
    createdAt: '2020-01-01T00:00:00Z'
  },
  {
    id: 4,
    code: 'MTECH-CSE',
    name: 'M.Tech in Advanced Computer Systems',
    description: 'Postgraduate research-oriented degree',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    durationYears: 2,
    totalSemesters: 4,
    active: true,
    createdAt: '2020-01-01T00:00:00Z'
  },
  {
    id: 5,
    code: 'MBA',
    name: 'Master of Business Administration',
    description: 'Flagship 2-year general management program',
    departmentId: 5,
    departmentName: 'School of Management Studies',
    durationYears: 2,
    totalSemesters: 4,
    active: true,
    createdAt: '2020-01-01T00:00:00Z'
  }
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: 1,
    studentId: 'STU-2023-001',
    userId: 5,
    firstName: 'Arjun',
    lastName: 'Kapoor',
    email: 'student.arjun@college.edu',
    phone: '+91 98765 43210',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    departmentCode: 'CSE',
    courseId: 1,
    courseName: 'B.Tech in Computer Science & Engineering',
    currentSemester: 6,
    section: 'A',
    admissionDate: '2021-08-16',
    dateOfBirth: '2003-05-12',
    gender: 'MALE',
    bloodGroup: 'O+',
    address: '42 Orchid Heights, Bannerghatta Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    pincode: '560076',
    guardianName: 'Sanjay Kapoor',
    guardianPhone: '+91 98765 00001',
    guardianRelation: 'Father',
    status: 'ACTIVE',
    createdAt: '2021-08-16T10:00:00Z'
  },
  {
    id: 2,
    studentId: 'STU-2023-002',
    userId: 11,
    firstName: 'Priya',
    lastName: 'Nair',
    email: 'priya.nair@college.edu',
    phone: '+91 98765 43211',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    departmentCode: 'CSE',
    courseId: 1,
    courseName: 'B.Tech in Computer Science & Engineering',
    currentSemester: 6,
    section: 'A',
    admissionDate: '2021-08-16',
    dateOfBirth: '2003-09-24',
    gender: 'FEMALE',
    bloodGroup: 'B+',
    address: '15 Palm Meadows',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    pincode: '560066',
    guardianName: 'K. Unnikrishnan',
    guardianPhone: '+91 98765 00002',
    guardianRelation: 'Father',
    status: 'ACTIVE',
    createdAt: '2021-08-16T10:00:00Z'
  },
  {
    id: 3,
    studentId: 'STU-2023-003',
    userId: 12,
    firstName: 'Rohan',
    lastName: 'Verma',
    email: 'rohan.verma@college.edu',
    phone: '+91 98765 43212',
    departmentId: 2,
    departmentName: 'Electronics & Communication',
    departmentCode: 'ECE',
    courseId: 3,
    courseName: 'B.Tech in Electronics & Communication',
    currentSemester: 4,
    section: 'B',
    admissionDate: '2022-08-10',
    dateOfBirth: '2004-03-18',
    gender: 'MALE',
    bloodGroup: 'A+',
    address: '88 Cyber City View',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    pincode: '500081',
    guardianName: 'Vikas Verma',
    guardianPhone: '+91 98765 00003',
    guardianRelation: 'Father',
    status: 'ACTIVE',
    createdAt: '2022-08-10T10:00:00Z'
  },
  {
    id: 4,
    studentId: 'STU-2023-004',
    userId: 13,
    firstName: 'Sneha',
    lastName: 'Patel',
    email: 'sneha.patel@college.edu',
    phone: '+91 98765 43213',
    departmentId: 5,
    departmentName: 'School of Management Studies',
    departmentCode: 'MGMT',
    courseId: 5,
    courseName: 'Master of Business Administration',
    currentSemester: 2,
    section: 'A',
    admissionDate: '2023-07-22',
    dateOfBirth: '2001-11-05',
    gender: 'FEMALE',
    bloodGroup: 'AB+',
    address: '104 SG Highway',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    pincode: '380054',
    guardianName: 'Girish Patel',
    guardianPhone: '+91 98765 00004',
    guardianRelation: 'Father',
    status: 'ACTIVE',
    createdAt: '2023-07-22T10:00:00Z'
  },
  {
    id: 5,
    studentId: 'STU-2023-005',
    userId: 14,
    firstName: 'Devendra',
    lastName: 'Choudhury',
    email: 'devendra.c@college.edu',
    phone: '+91 98765 43214',
    departmentId: 3,
    departmentName: 'Mechanical Engineering',
    departmentCode: 'MECH',
    courseId: 1,
    courseName: 'B.Tech in Mechanical Engineering',
    currentSemester: 8,
    section: 'A',
    admissionDate: '2020-08-15',
    dateOfBirth: '2002-01-30',
    gender: 'MALE',
    bloodGroup: 'O-',
    address: '12 Sector 17',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    pincode: '411028',
    guardianName: 'R. Choudhury',
    guardianPhone: '+91 98765 00005',
    guardianRelation: 'Father',
    status: 'ACTIVE',
    createdAt: '2020-08-15T10:00:00Z'
  }
];

export const MOCK_PROFESSORS: Professor[] = [
  {
    id: 1,
    employeeId: 'EMP-FAC-001',
    userId: 3,
    firstName: 'Dr. Ananya',
    lastName: 'Sharma',
    email: 'hod.cse@college.edu',
    phone: '+91 98111 22334',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    designation: 'Professor & HOD',
    qualification: 'Ph.D. in Computer Science (IISc Bangalore)',
    specialization: 'Distributed Systems & Cloud Computing',
    experienceYears: 16,
    dateOfBirth: '1979-04-14',
    gender: 'FEMALE',
    joiningDate: '2012-06-01',
    address: 'Professors Enclave, Campus East',
    status: 'ACTIVE',
    createdAt: '2012-06-01T00:00:00Z'
  },
  {
    id: 2,
    employeeId: 'EMP-FAC-002',
    userId: 4,
    firstName: 'Prof. Vikram',
    lastName: 'Mehta',
    email: 'prof.vikram@college.edu',
    phone: '+91 98222 33445',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    qualification: 'M.Tech, Ph.D. Candidate (IIT Bombay)',
    specialization: 'Artificial Intelligence & Deep Learning',
    experienceYears: 11,
    dateOfBirth: '1984-08-20',
    gender: 'MALE',
    joiningDate: '2016-07-15',
    address: 'Green Glen Layout, Bellandur',
    status: 'ACTIVE',
    createdAt: '2016-07-15T00:00:00Z'
  },
  {
    id: 3,
    employeeId: 'EMP-FAC-003',
    userId: 7,
    firstName: 'Dr. Srinivas',
    lastName: 'Rao',
    email: 'hod.ece@college.edu',
    phone: '+91 98333 44556',
    departmentId: 2,
    departmentName: 'Electronics & Communication',
    designation: 'Professor & HOD',
    qualification: 'Ph.D. in Microelectronics (IIT Madras)',
    specialization: 'VLSI Design & Embedded Systems',
    experienceYears: 18,
    dateOfBirth: '1976-12-02',
    gender: 'MALE',
    joiningDate: '2010-09-01',
    address: 'Faculty Quarters B-12',
    status: 'ACTIVE',
    createdAt: '2010-09-01T00:00:00Z'
  },
  {
    id: 4,
    employeeId: 'EMP-FAC-004',
    userId: 8,
    firstName: 'Dr. Meera',
    lastName: 'Iyer',
    email: 'hod.civil@college.edu',
    phone: '+91 98444 55667',
    departmentId: 4,
    departmentName: 'Civil & Environmental Engineering',
    designation: 'Professor & HOD',
    qualification: 'Ph.D. in Structural Engineering (IIT Roorkee)',
    specialization: 'Earthquake-Resistant Structures',
    experienceYears: 14,
    dateOfBirth: '1981-03-29',
    gender: 'FEMALE',
    joiningDate: '2014-04-10',
    address: 'Apartment 402, Royal Residency',
    status: 'ACTIVE',
    createdAt: '2014-04-10T00:00:00Z'
  }
];

export const MOCK_NOTICES: Notice[] = [
  {
    id: 1,
    title: 'Mid-Semester Examination Schedule Announced (Spring 2026)',
    content: 'The Mid-Semester theory and practical examinations for B.Tech semesters 4, 6 and M.Tech semester 2 will commence from October 12, 2026. Hall tickets can be downloaded from the student portal starting October 5.',
    noticeType: 'EXAMINATION',
    targetAudience: 'ALL',
    priority: 'HIGH',
    isPublished: true,
    publishedAt: '2026-09-25T09:00:00Z',
    validUntil: '2026-10-30T23:59:59Z',
    createdAt: '2026-09-25T09:00:00Z'
  },
  {
    id: 2,
    title: 'Annual Tech Symposium "INVENTO 2026" - Call for Papers',
    content: 'Apex Institute is hosting its flagship International Technical Conference and Hackathon on November 14-16, 2026. Submissions for research tracks in AI, Robotics, and Green Energy are now open.',
    noticeType: 'EVENT',
    targetAudience: 'ALL',
    priority: 'MEDIUM',
    isPublished: true,
    publishedAt: '2026-09-20T11:30:00Z',
    validUntil: '2026-11-20T23:59:59Z',
    createdAt: '2026-09-20T11:30:00Z'
  },
  {
    id: 3,
    title: 'Campus Recruitment Drive: Google, Microsoft & Oracle',
    content: 'Final year graduating students (Batch 2026) are advised that on-campus hiring assessments will begin next Monday in Auditorium 1. Resume validation must be completed with the Placement Cell by Friday 5 PM.',
    noticeType: 'PLACEMENT',
    targetAudience: 'STUDENTS',
    priority: 'HIGH',
    isPublished: true,
    publishedAt: '2026-09-28T14:15:00Z',
    validUntil: '2026-10-15T23:59:59Z',
    createdAt: '2026-09-28T14:15:00Z'
  },
  {
    id: 4,
    title: 'Library Extended Hours for Exam Preparation',
    content: 'The Central Digital Library will remain open 24/7 beginning next week through the exam period. Study cubicles can be reserved online via the Library Portal.',
    noticeType: 'GENERAL',
    targetAudience: 'ALL',
    priority: 'LOW',
    isPublished: true,
    publishedAt: '2026-09-22T08:00:00Z',
    validUntil: '2026-11-01T23:59:59Z',
    createdAt: '2026-09-22T08:00:00Z'
  }
];

export const MOCK_FEES: StudentFee[] = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Arjun Kapoor',
    studentCode: 'STU-2023-001',
    totalAmount: 85000,
    paidAmount: 85000,
    discountAmount: 0,
    dueDate: '2026-08-31',
    status: 'PAID'
  },
  {
    id: 2,
    studentId: 2,
    studentName: 'Priya Nair',
    studentCode: 'STU-2023-002',
    totalAmount: 85000,
    paidAmount: 50000,
    discountAmount: 0,
    dueDate: '2026-10-15',
    status: 'PARTIAL'
  },
  {
    id: 3,
    studentId: 3,
    studentName: 'Rohan Verma',
    studentCode: 'STU-2023-003',
    totalAmount: 80000,
    paidAmount: 0,
    discountAmount: 5000,
    dueDate: '2026-09-15',
    status: 'OVERDUE'
  },
  {
    id: 4,
    studentId: 4,
    studentName: 'Sneha Patel',
    studentCode: 'STU-2023-004',
    totalAmount: 120000,
    paidAmount: 120000,
    discountAmount: 10000,
    dueDate: '2026-08-31',
    status: 'PAID'
  },
  {
    id: 5,
    studentId: 5,
    studentName: 'Devendra Choudhury',
    studentCode: 'STU-2023-005',
    totalAmount: 75000,
    paidAmount: 0,
    discountAmount: 0,
    dueDate: '2026-10-31',
    status: 'PENDING'
  }
];

export const MOCK_BOOKS: Book[] = [
  {
    id: 1,
    isbn: '978-0131103627',
    title: 'The C Programming Language (2nd Edition)',
    author: 'Brian W. Kernighan, Dennis M. Ritchie',
    publisher: 'Prentice Hall',
    category: 'Computer Science',
    publicationYear: 1988,
    totalCopies: 25,
    availableCopies: 18,
    rackNumber: 'CS-A1-04'
  },
  {
    id: 2,
    isbn: '978-0262033848',
    title: 'Introduction to Algorithms (CLRS 3rd Edition)',
    author: 'Thomas H. Cormen, Charles E. Leiserson',
    publisher: 'MIT Press',
    category: 'Algorithms',
    publicationYear: 2009,
    totalCopies: 40,
    availableCopies: 8,
    rackNumber: 'CS-A2-12'
  },
  {
    id: 3,
    isbn: '978-0134685991',
    title: 'Effective Java (3rd Edition)',
    author: 'Joshua Bloch',
    publisher: 'Addison-Wesley Professional',
    category: 'Software Engineering',
    publicationYear: 2018,
    totalCopies: 30,
    availableCopies: 22,
    rackNumber: 'CS-B1-09'
  },
  {
    id: 4,
    isbn: '978-0073529325',
    title: 'Database System Concepts (7th Edition)',
    author: 'Abraham Silberschatz, Henry F. Korth',
    publisher: 'McGraw-Hill',
    category: 'Database Systems',
    publicationYear: 2019,
    totalCopies: 35,
    availableCopies: 14,
    rackNumber: 'CS-B3-15'
  },
  {
    id: 5,
    isbn: '978-0262035612',
    title: 'Deep Learning',
    author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
    publisher: 'MIT Press',
    category: 'Artificial Intelligence',
    publicationYear: 2016,
    totalCopies: 20,
    availableCopies: 5,
    rackNumber: 'AI-C2-01'
  }
];

export const MOCK_LEAVES: LeaveRequest[] = [
  {
    id: 1,
    applicantUserId: 4,
    applicantName: 'Prof. Vikram Mehta',
    leaveType: 'CONFERENCE_LEAVE',
    startDate: '2026-10-14',
    endDate: '2026-10-17',
    totalDays: 4,
    reason: 'Presenting research paper on Transformer Optimizations at ACM SIGKDD.',
    status: 'APPROVED',
    appliedAt: '2026-09-20T10:15:00Z',
    approvedBy: 2,
    approvedByName: 'Dr. Rajesh Kumar (Principal)',
    approvedAt: '2026-09-21T14:00:00Z'
  },
  {
    id: 2,
    applicantUserId: 5,
    applicantName: 'Arjun Kapoor (Student)',
    leaveType: 'MEDICAL_LEAVE',
    startDate: '2026-10-02',
    endDate: '2026-10-04',
    totalDays: 3,
    reason: 'Undergoing dental surgery and post-op recovery.',
    status: 'PENDING',
    appliedAt: '2026-09-29T16:45:00Z'
  },
  {
    id: 3,
    applicantUserId: 3,
    applicantName: 'Dr. Ananya Sharma',
    leaveType: 'CASUAL_LEAVE',
    startDate: '2026-10-24',
    endDate: '2026-10-25',
    totalDays: 2,
    reason: 'Attending family wedding ceremony.',
    status: 'PENDING',
    appliedAt: '2026-09-28T09:30:00Z'
  }
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 1, studentId: 1, studentName: 'Arjun Kapoor', studentCode: 'STU-2023-001', subjectId: 101, subjectName: 'Distributed Systems', attendanceDate: '2026-09-30', status: 'PRESENT' },
  { id: 2, studentId: 2, studentName: 'Priya Nair', studentCode: 'STU-2023-002', subjectId: 101, subjectName: 'Distributed Systems', attendanceDate: '2026-09-30', status: 'PRESENT' },
  { id: 3, studentId: 3, studentName: 'Rohan Verma', studentCode: 'STU-2023-003', subjectId: 101, subjectName: 'Distributed Systems', attendanceDate: '2026-09-30', status: 'ABSENT', remarks: 'Medical certificate submitted' },
  { id: 4, studentId: 4, studentName: 'Sneha Patel', studentCode: 'STU-2023-004', subjectId: 101, subjectName: 'Distributed Systems', attendanceDate: '2026-09-30', status: 'PRESENT' },
  { id: 5, studentId: 5, studentName: 'Devendra Choudhury', studentCode: 'STU-2023-005', subjectId: 101, subjectName: 'Distributed Systems', attendanceDate: '2026-09-30', status: 'LATE', remarks: 'Delayed by 15 mins' }
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalStudents: 2840,
  totalProfessors: 164,
  totalDepartments: 8,
  totalCourses: 24,
  attendancePercentage: 89.2,
  pendingLeaveRequests: 7,
  upcomingExams: 14,
  unpaidFees: 38
};

export const MOCK_TIMETABLE = [
  { day: 'Monday', time: '09:00 - 10:00 AM', subject: 'Distributed Systems (CS601)', room: 'LH-101', faculty: 'Dr. Ananya Sharma' },
  { day: 'Monday', time: '10:00 - 11:00 AM', subject: 'Machine Learning (CS602)', room: 'LH-101', faculty: 'Prof. Vikram Mehta' },
  { day: 'Monday', time: '11:15 - 01:15 PM', subject: 'Cloud Computing Lab (CS603L)', room: 'Lab-4', faculty: 'Prof. Vikram Mehta' },
  { day: 'Tuesday', time: '09:00 - 10:00 AM', subject: 'Compiler Design (CS604)', room: 'LH-102', faculty: 'Dr. Srinivas Rao' },
  { day: 'Tuesday', time: '10:00 - 11:00 AM', subject: 'Distributed Systems (CS601)', room: 'LH-101', faculty: 'Dr. Ananya Sharma' },
  { day: 'Wednesday', time: '09:00 - 11:00 AM', subject: 'AI Project Workshop', room: 'Incubation Lab', faculty: 'Dr. Ananya Sharma' },
  { day: 'Thursday', time: '10:00 - 12:00 PM', subject: 'Cyber Security (CS605)', room: 'LH-103', faculty: 'Dr. Rajesh Kumar' },
  { day: 'Friday', time: '02:00 - 04:00 PM', subject: 'Seminar & Technical Presentation', room: 'Seminar Hall B', faculty: 'Faculty Panel' },
];

export const MOCK_EXAMS = [
  { id: 1, title: 'Mid-Term Exam - Distributed Systems', date: '2026-10-12', time: '10:00 AM - 12:00 PM', totalMarks: 50, passMarks: 20, hall: 'Block A, Hall 1' },
  { id: 2, title: 'Mid-Term Exam - Machine Learning', date: '2026-10-14', time: '10:00 AM - 12:00 PM', totalMarks: 50, passMarks: 20, hall: 'Block A, Hall 2' },
  { id: 3, title: 'Mid-Term Exam - Compiler Design', date: '2026-10-16', time: '10:00 AM - 12:00 PM', totalMarks: 50, passMarks: 20, hall: 'Block B, Hall 1' },
  { id: 4, title: 'Practical Lab Exam - Cloud Systems', date: '2026-10-19', time: '09:00 AM - 01:00 PM', totalMarks: 100, passMarks: 40, hall: 'Systems Lab 3' }
];

export const MOCK_STUDENT_RESULTS = [
  { code: 'CS601', subject: 'Distributed Systems', credits: 4, grade: 'A+', gradePoint: 10, marks: 92, status: 'PASS' },
  { code: 'CS602', subject: 'Machine Learning', credits: 4, grade: 'A', gradePoint: 9, marks: 86, status: 'PASS' },
  { code: 'CS603', subject: 'Compiler Design', credits: 3, grade: 'B+', gradePoint: 8, marks: 78, status: 'PASS' },
  { code: 'CS604L', subject: 'Cloud Computing Lab', credits: 2, grade: 'A+', gradePoint: 10, marks: 95, status: 'PASS' },
  { code: 'HU601', subject: 'Engineering Ethics & IPR', credits: 2, grade: 'A', gradePoint: 9, marks: 84, status: 'PASS' }
];

export const MOCK_AUDIT_LOGS = [
  { id: 1, userEmail: 'superadmin@college.edu', action: 'CREATE_USER', entityName: 'Student', details: 'Registered STU-2023-005 Devendra Choudhury', ipAddress: '192.168.1.15', timestamp: '2026-09-30 08:45:12', status: 'SUCCESS' },
  { id: 2, userEmail: 'accountant@college.edu', action: 'RECORD_PAYMENT', entityName: 'FeePayment', details: 'Collected Rs 85,000 for Arjun Kapoor', ipAddress: '192.168.1.42', timestamp: '2026-09-30 08:12:05', status: 'SUCCESS' },
  { id: 3, userEmail: 'hod.cse@college.edu', action: 'MARK_ATTENDANCE', entityName: 'Attendance', details: 'Marked 45 students for CS601', ipAddress: '192.168.1.88', timestamp: '2026-09-30 07:55:40', status: 'SUCCESS' },
  { id: 4, userEmail: 'principal@college.edu', action: 'APPROVE_LEAVE', entityName: 'LeaveRequest', details: 'Approved conference leave for Prof. Vikram Mehta', ipAddress: '192.168.1.10', timestamp: '2026-09-29 17:30:00', status: 'SUCCESS' },
  { id: 5, userEmail: 'superadmin@college.edu', action: 'UPDATE_ROLE', entityName: 'Role', details: 'Modified permissions for HOD role', ipAddress: '192.168.1.15', timestamp: '2026-09-29 14:10:22', status: 'SUCCESS' }
];
