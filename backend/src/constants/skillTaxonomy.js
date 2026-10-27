/**
 * DevConnect Role Taxonomy & Skill Matrix
 * Milestone 5: AI Skill Gap Analyzer & Student Career Intelligence
 */

const ROLE_TAXONOMY = {
  'Backend Developer': {
    title: 'Backend Developer',
    description: 'Specializes in server-side logic, API architecture, data persistence, and scalable microservices.',
    requiredSkills: [
      'Node.js',
      'Express',
      'MongoDB',
      'REST APIs',
      'SQL',
      'Git',
      'Docker',
      'Redis'
    ],
    recommendations: {
      'Node.js': 'Master event loops, stream processing, worker threads, and asynchronous design patterns in Node.js.',
      'Express': 'Build robust Express middleware for error handling, rate limiting, and JWT authentication.',
      'MongoDB': 'Deepen knowledge in Mongoose schema indexing, aggregation pipelines, and transaction management.',
      'REST APIs': 'Design idempotent RESTful endpoints following standard HTTP methods, status codes, and OpenAPI specs.',
      'SQL': 'Practice relational data modeling, indexing strategies, and complex SQL joins using PostgreSQL or MySQL.',
      'Git': 'Adopt professional Git workflows, conventional commits, and pull-request collaboration habits.',
      'Docker': 'Containerize backend services with multi-stage Dockerfiles and master docker-compose setups.',
      'Redis': 'Implement in-memory caching for query acceleration, distributed locks, and session storage.'
    },
    suggestedProjects: [
      'Build a high-throughput REST API with rate-limiting, JWT authentication, and Redis caching.',
      'Create a containerized microservice connected to MongoDB and PostgreSQL with automated health checks.'
    ]
  },

  'Frontend Developer': {
    title: 'Frontend Developer',
    description: 'Designs and builds responsive, accessible, dynamic user interfaces and client-side applications.',
    requiredSkills: [
      'JavaScript',
      'TypeScript',
      'React',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
      'Git',
      'Responsive Design'
    ],
    recommendations: {
      'JavaScript': 'Solidify ES6+ syntax, closures, promises, prototypes, and asynchronous JavaScript.',
      'TypeScript': 'Adopt TypeScript for strict static typing, interfaces, and safe React component props.',
      'React': 'Master custom hooks, React context, component lifecycle, and state optimization patterns.',
      'HTML5': 'Implement semantic markup, web accessibility (WCAG/ARIA), and SEO meta conventions.',
      'CSS3': 'Harness modern CSS grid, flexbox, CSS variables, and fluid transitions/animations.',
      'Tailwind CSS': 'Build cohesive design systems with utility classes, Tailwind configuration, and dark mode.',
      'Git': 'Maintain feature branches and collaborate using GitHub pull requests and code reviews.',
      'Responsive Design': 'Craft fluid mobile-first layouts supporting diverse breakpoints and touch interactions.'
    },
    suggestedProjects: [
      'Develop a modern responsive SaaS landing page with dark mode, animations, and accessible modals.',
      'Build an interactive dashboard consuming REST APIs with optimistic UI updates and skeleton loading.'
    ]
  },

  'Full Stack Engineer': {
    title: 'Full Stack Engineer',
    description: 'Bridges client-side interactivity and server-side engineering to deliver end-to-end applications.',
    requiredSkills: [
      'JavaScript',
      'React',
      'Node.js',
      'Express',
      'MongoDB',
      'REST APIs',
      'Docker',
      'Git'
    ],
    recommendations: {
      'JavaScript': 'Gain full-stack fluency in modern JavaScript across browser and Node.js environments.',
      'React': 'Build reusable modular UI components connected directly to backend REST endpoints.',
      'Node.js': 'Architect performant server runtimes with non-blocking I/O and secure configuration.',
      'Express': 'Structure controllers, services, and middlewares for clean domain-driven architecture.',
      'MongoDB': 'Model document hierarchies, compound indexes, and referential integrity in MongoDB.',
      'REST APIs': 'Implement cohesive end-to-end data contracts between React frontends and Express APIs.',
      'Docker': 'Package client and server applications into a multi-container local development environment.',
      'Git': 'Manage monorepos or multi-service repositories with clean git branching practices.'
    },
    suggestedProjects: [
      'Develop a complete full-stack portal with authentication, file uploads, and CRUD dashboards.',
      'Create an e-commerce or job portal prototype with cart/application workflows and automated tests.'
    ]
  },

  'Data Scientist': {
    title: 'Data Scientist',
    description: 'Analyzes complex datasets, extracts actionable insights, and trains predictive machine learning models.',
    requiredSkills: [
      'Python',
      'Pandas',
      'NumPy',
      'Scikit-Learn',
      'SQL',
      'Machine Learning',
      'Data Visualization',
      'Git'
    ],
    recommendations: {
      'Python': 'Master Python idioms, list comprehensions, generators, and object-oriented programming.',
      'Pandas': 'Clean, filter, reshape, and aggregate multi-dimensional tabular datasets with Pandas.',
      'NumPy': 'Manipulate N-dimensional arrays, vectorized operations, and linear algebra routines.',
      'Scikit-Learn': 'Build cross-validated classification, regression, and clustering pipelines.',
      'SQL': 'Extract features and analytical views using window functions, CTEs, and complex joins.',
      'Machine Learning': 'Understand bias-variance tradeoffs, feature engineering, and evaluation metrics (AUC, F1).',
      'Data Visualization': 'Communicate statistical findings using Matplotlib, Seaborn, or interactive Plotly charts.',
      'Git': 'Track and version exploratory data notebooks, experiment scripts, and dataset pipelines.'
    },
    suggestedProjects: [
      'Analyze a real-world dataset to build an end-to-end customer churn prediction pipeline.',
      'Create an interactive exploratory data dashboard visualizing trends and model evaluation curves.'
    ]
  },

  'DevOps Engineer': {
    title: 'DevOps Engineer',
    description: 'Automates infrastructure deployment, CI/CD pipelines, container orchestration, and reliability monitoring.',
    requiredSkills: [
      'Linux',
      'Docker',
      'Kubernetes',
      'CI/CD',
      'AWS',
      'Terraform',
      'Git',
      'Bash'
    ],
    recommendations: {
      'Linux': 'Deepen Linux fundamentals, system administration, process signals, and network debugging.',
      'Docker': 'Craft secure, minimal container images using multi-stage builds and Alpine/slim bases.',
      'Kubernetes': 'Deploy pods, services, config maps, ingresses, and horizontal pod autoscalers.',
      'CI/CD': 'Construct automated test, lint, and deployment pipelines using GitHub Actions workflows.',
      'AWS': 'Provision and manage essential cloud resources: VPC, EC2, ECS, S3, IAM, and CloudWatch.',
      'Terraform': 'Codify cloud infrastructure using declarative HashiCorp Terraform modules.',
      'Git': 'Implement GitOps infrastructure delivery where pull requests trigger pipeline rollouts.',
      'Bash': 'Write idempotent shell scripts for environment provisioning and server maintenance.'
    },
    suggestedProjects: [
      'Design an automated GitHub Actions pipeline that builds Docker images and runs integration tests.',
      'Provision a secure AWS VPC and containerized application stack using declarative Terraform scripts.'
    ]
  }
};

/**
 * Normalization dictionary for common skill aliases and typos
 */
const SKILL_ALIASES = {
  // JavaScript & TypeScript
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'es6': 'JavaScript',
  'ts': 'TypeScript',
  'typescript': 'TypeScript',

  // Backend & Runtime
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'node.js': 'Node.js',
  'express': 'Express',
  'expressjs': 'Express',
  'express.js': 'Express',
  'rest': 'REST APIs',
  'rest api': 'REST APIs',
  'rest apis': 'REST APIs',
  'restful': 'REST APIs',
  'restful api': 'REST APIs',
  'restful apis': 'REST APIs',

  // Database
  'mongo': 'MongoDB',
  'mongodb': 'MongoDB',
  'mongoose': 'MongoDB',
  'sql': 'SQL',
  'mysql': 'SQL',
  'postgres': 'SQL',
  'postgresql': 'SQL',
  'sqlite': 'SQL',
  'redis': 'Redis',
  'redis cache': 'Redis',

  // Frontend
  'react': 'React',
  'reactjs': 'React',
  'react.js': 'React',
  'html': 'HTML5',
  'html5': 'HTML5',
  'css': 'CSS3',
  'css3': 'CSS3',
  'tailwind': 'Tailwind CSS',
  'tailwindcss': 'Tailwind CSS',
  'responsive': 'Responsive Design',
  'responsive design': 'Responsive Design',
  'mobile-first': 'Responsive Design',

  // Version Control & DevOps
  'git': 'Git',
  'github': 'Git',
  'gitlab': 'Git',
  'docker': 'Docker',
  'docker compose': 'Docker',
  'kubernetes': 'Kubernetes',
  'k8s': 'Kubernetes',
  'ci/cd': 'CI/CD',
  'cicd': 'CI/CD',
  'github actions': 'CI/CD',
  'linux': 'Linux',
  'ubuntu': 'Linux',
  'bash': 'Bash',
  'shell': 'Bash',
  'aws': 'AWS',
  'amazon web services': 'AWS',
  'terraform': 'Terraform',

  // Python & Data Science
  'python': 'Python',
  'python3': 'Python',
  'pandas': 'Pandas',
  'numpy': 'NumPy',
  'scikit-learn': 'Scikit-Learn',
  'sklearn': 'Scikit-Learn',
  'machine learning': 'Machine Learning',
  'ml': 'Machine Learning',
  'data visualization': 'Data Visualization',
  'matplotlib': 'Data Visualization',
  'seaborn': 'Data Visualization',
  'plotly': 'Data Visualization'
};

/**
 * Normalize an arbitrary skill string to its canonical form
 * @param {string} skill
 * @returns {string} Canonical skill name
 */
const normalizeSkill = (skill) => {
  if (!skill || typeof skill !== 'string') return '';
  const clean = skill.trim().toLowerCase();
  return SKILL_ALIASES[clean] || (skill.trim().charAt(0).toUpperCase() + skill.trim().slice(1));
};

/**
 * Retrieve supported role taxonomy details
 * @param {string} roleTitle
 * @returns {object|null}
 */
const getRoleTaxonomy = (roleTitle) => {
  if (!roleTitle || typeof roleTitle !== 'string') return null;
  // Match case-insensitively
  const matchKey = Object.keys(ROLE_TAXONOMY).find(
    (k) => k.toLowerCase() === roleTitle.trim().toLowerCase()
  );
  return matchKey ? ROLE_TAXONOMY[matchKey] : null;
};

/**
 * List all available taxonomy roles
 * @returns {Array<object>}
 */
const getAllTaxonomyRoles = () => {
  return Object.values(ROLE_TAXONOMY).map((role) => ({
    title: role.title,
    description: role.description,
    requiredSkillsCount: role.requiredSkills.length,
    requiredSkills: role.requiredSkills
  }));
};

module.exports = {
  ROLE_TAXONOMY,
  SKILL_ALIASES,
  normalizeSkill,
  getRoleTaxonomy,
  getAllTaxonomyRoles
};
