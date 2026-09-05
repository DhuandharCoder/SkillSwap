export interface MitsBranch {
  value: string;
  label: string;
  code: string;
}

export interface MitsBranchCategory {
  category: string;
  branches: MitsBranch[];
}

export const MITS_BRANCH_CATEGORIES: MitsBranchCategory[] = [
  {
    category: 'Computer Science & Emerging Computing',
    branches: [
      {
        value: 'Computer Science & Engineering',
        label: 'Computer Science & Engineering (CSE)',
        code: 'CSE',
      },
      {
        value: 'Artificial Intelligence & Machine Learning',
        label: 'Artificial Intelligence & Machine Learning (AI & ML)',
        code: 'AI & ML',
      },
      {
        value: 'Artificial Intelligence & Data Science',
        label: 'Artificial Intelligence & Data Science (AI & DS)',
        code: 'AI & DS',
      },
      {
        value: 'Information Technology',
        label: 'Information Technology (IT)',
        code: 'IT',
      },
      {
        value: 'Information Technology (Artificial Intelligence)',
        label: 'Information Technology - AI (IT-AI)',
        code: 'IT-AI',
      },
      {
        value: 'Mathematics & Computing',
        label: 'Mathematics & Computing (MAC)',
        code: 'MAC',
      },
      {
        value: 'Computer Science & Design',
        label: 'Computer Science & Design (CSD)',
        code: 'CSD',
      },
      {
        value: 'Computer Science & Business Systems',
        label: 'Computer Science & Business Systems (CSBS)',
        code: 'CSBS',
      },
      {
        value: 'Computer Science & Technology',
        label: 'Computer Science & Technology (CST)',
        code: 'CST',
      },
      {
        value: 'Internet of Things (IoT)',
        label: 'Internet of Things (IoT)',
        code: 'IoT',
      },
    ],
  },
  {
    category: 'Electronics & Electrical Engineering',
    branches: [
      {
        value: 'Electronics & Communication Engineering',
        label: 'Electronics & Communication Engineering (ECE)',
        code: 'ECE',
      },
      {
        value: 'Electronics & Telecommunication Engineering',
        label: 'Electronics & Telecommunication Engineering (ETE)',
        code: 'ETE',
      },
      {
        value: 'Electronics Engineering (VLSI Design & Technology)',
        label: 'Electronics Engineering - VLSI (VLSI)',
        code: 'VLSI',
      },
      {
        value: 'Electrical Engineering',
        label: 'Electrical Engineering (EE)',
        code: 'EE',
      },
      {
        value: 'Electrical & Computer Engineering',
        label: 'Electrical & Computer Engineering',
        code: 'El & Comp',
      },
    ],
  },
  {
    category: 'Core Engineering Branches',
    branches: [
      {
        value: 'Mechanical Engineering',
        label: 'Mechanical Engineering (ME)',
        code: 'ME',
      },
      {
        value: 'Civil Engineering',
        label: 'Civil Engineering (CE)',
        code: 'CE',
      },
      {
        value: 'Chemical Engineering',
        label: 'Chemical Engineering (CHE)',
        code: 'CHE',
      },
      {
        value: 'Automobile Engineering',
        label: 'Automobile Engineering (AU)',
        code: 'AU',
      },
      {
        value: 'Biotechnology',
        label: 'Biotechnology (BT)',
        code: 'BT',
      },
    ],
  },
  {
    category: 'Architecture, Planning & Post-Graduate',
    branches: [
      {
        value: 'Architecture (B.Arch)',
        label: 'Bachelor of Architecture (B.Arch)',
        code: 'B.Arch',
      },
      {
        value: 'Urban Planning (B.Plan)',
        label: 'Bachelor of Planning (B.Plan)',
        code: 'B.Plan',
      },
      {
        value: 'Master of Computer Applications (MCA)',
        label: 'Master of Computer Applications (MCA)',
        code: 'MCA',
      },
      {
        value: 'Master of Business Administration (MBA)',
        label: 'Master of Business Administration (MBA)',
        code: 'MBA',
      },
    ],
  },
];

export const ALL_MITS_BRANCHES: MitsBranch[] = MITS_BRANCH_CATEGORIES.flatMap(
  (c) => c.branches
);
