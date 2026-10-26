"""
Skill Gap Analysis Service - FastAPI Microservice
Milestone 5: AI Skill Gap Analyzer & Student Career Intelligence
"""

from typing import List, Dict, Any, Optional

ROLE_TAXONOMY: Dict[str, Dict[str, Any]] = {
    "Backend Developer": {
        "title": "Backend Developer",
        "description": "Specializes in server-side logic, API architecture, data persistence, and scalable microservices.",
        "required_skills": [
            "Node.js", "Express", "MongoDB", "REST APIs", "SQL", "Git", "Docker", "Redis"
        ],
        "recommendations": {
            "Node.js": "Master event loops, stream processing, worker threads, and asynchronous design patterns in Node.js.",
            "Express": "Build robust Express middleware for error handling, rate limiting, and JWT authentication.",
            "MongoDB": "Deepen knowledge in Mongoose schema indexing, aggregation pipelines, and transaction management.",
            "REST APIs": "Design idempotent RESTful endpoints following standard HTTP methods, status codes, and OpenAPI specs.",
            "SQL": "Practice relational data modeling, indexing strategies, and complex SQL joins using PostgreSQL or MySQL.",
            "Git": "Adopt professional Git workflows, conventional commits, and pull-request collaboration habits.",
            "Docker": "Containerize backend services with multi-stage Dockerfiles and master docker-compose setups.",
            "Redis": "Implement in-memory caching for query acceleration, distributed locks, and session storage."
        },
        "suggested_projects": [
            "Build a high-throughput REST API with rate-limiting, JWT authentication, and Redis caching.",
            "Create a containerized microservice connected to MongoDB and PostgreSQL with automated health checks."
        ]
    },
    "Frontend Developer": {
        "title": "Frontend Developer",
        "description": "Designs and builds responsive, accessible, dynamic user interfaces and client-side applications.",
        "required_skills": [
            "JavaScript", "TypeScript", "React", "HTML5", "CSS3", "Tailwind CSS", "Git", "Responsive Design"
        ],
        "recommendations": {
            "JavaScript": "Solidify ES6+ syntax, closures, promises, prototypes, and asynchronous JavaScript.",
            "TypeScript": "Adopt TypeScript for strict static typing, interfaces, and safe React component props.",
            "React": "Master custom hooks, React context, component lifecycle, and state optimization patterns.",
            "HTML5": "Implement semantic markup, web accessibility (WCAG/ARIA), and SEO meta conventions.",
            "CSS3": "Harness modern CSS grid, flexbox, CSS variables, and fluid transitions/animations.",
            "Tailwind CSS": "Build cohesive design systems with utility classes, Tailwind configuration, and dark mode.",
            "Git": "Maintain feature branches and collaborate using GitHub pull requests and code reviews.",
            "Responsive Design": "Craft fluid mobile-first layouts supporting diverse breakpoints and touch interactions."
        },
        "suggested_projects": [
            "Develop a modern responsive SaaS landing page with dark mode, animations, and accessible modals.",
            "Build an interactive dashboard consuming REST APIs with optimistic UI updates and skeleton loading."
        ]
    },
    "Full Stack Engineer": {
        "title": "Full Stack Engineer",
        "description": "Bridges client-side interactivity and server-side engineering to deliver end-to-end applications.",
        "required_skills": [
            "JavaScript", "React", "Node.js", "Express", "MongoDB", "REST APIs", "Docker", "Git"
        ],
        "recommendations": {
            "JavaScript": "Gain full-stack fluency in modern JavaScript across browser and Node.js environments.",
            "React": "Build reusable modular UI components connected directly to backend REST endpoints.",
            "Node.js": "Architect performant server runtimes with non-blocking I/O and secure configuration.",
            "Express": "Structure controllers, services, and middlewares for clean domain-driven architecture.",
            "MongoDB": "Model document hierarchies, compound indexes, and referential integrity in MongoDB.",
            "REST APIs": "Implement cohesive end-to-end data contracts between React frontends and Express APIs.",
            "Docker": "Package client and server applications into a multi-container local development environment.",
            "Git": "Manage monorepos or multi-service repositories with clean git branching practices."
        },
        "suggested_projects": [
            "Develop a complete full-stack portal with authentication, file uploads, and CRUD dashboards.",
            "Create an e-commerce or job portal prototype with cart/application workflows and automated tests."
        ]
    },
    "Data Scientist": {
        "title": "Data Scientist",
        "description": "Analyzes complex datasets, extracts actionable insights, and trains predictive machine learning models.",
        "required_skills": [
            "Python", "Pandas", "NumPy", "Scikit-Learn", "SQL", "Machine Learning", "Data Visualization", "Git"
        ],
        "recommendations": {
            "Python": "Master Python idioms, list comprehensions, generators, and object-oriented programming.",
            "Pandas": "Clean, filter, reshape, and aggregate multi-dimensional tabular datasets with Pandas.",
            "NumPy": "Manipulate N-dimensional arrays, vectorized operations, and linear algebra routines.",
            "Scikit-Learn": "Build cross-validated classification, regression, and clustering pipelines.",
            "SQL": "Extract features and analytical views using window functions, CTEs, and complex joins.",
            "Machine Learning": "Understand bias-variance tradeoffs, feature engineering, and evaluation metrics (AUC, F1).",
            "Data Visualization": "Communicate statistical findings using Matplotlib, Seaborn, or interactive Plotly charts.",
            "Git": "Track and version exploratory data notebooks, experiment scripts, and dataset pipelines."
        },
        "suggested_projects": [
            "Analyze a real-world dataset to build an end-to-end customer churn prediction pipeline.",
            "Create an interactive exploratory data dashboard visualizing trends and model evaluation curves."
        ]
    },
    "DevOps Engineer": {
        "title": "DevOps Engineer",
        "description": "Automates infrastructure deployment, CI/CD pipelines, container orchestration, and reliability monitoring.",
        "required_skills": [
            "Linux", "Docker", "Kubernetes", "CI/CD", "AWS", "Terraform", "Git", "Bash"
        ],
        "recommendations": {
            "Linux": "Deepen Linux fundamentals, system administration, process signals, and network debugging.",
            "Docker": "Craft secure, minimal container images using multi-stage builds and Alpine/slim bases.",
            "Kubernetes": "Deploy pods, services, config maps, ingresses, and horizontal pod autoscalers.",
            "CI/CD": "Construct automated test, lint, and deployment pipelines using GitHub Actions workflows.",
            "AWS": "Provision and manage essential cloud resources: VPC, EC2, ECS, S3, IAM, and CloudWatch.",
            "Terraform": "Codify cloud infrastructure using declarative HashiCorp Terraform modules.",
            "Git": "Implement GitOps infrastructure delivery where pull requests trigger pipeline rollouts.",
            "Bash": "Write idempotent shell scripts for environment provisioning and server maintenance."
        },
        "suggested_projects": [
            "Design an automated GitHub Actions pipeline that builds Docker images and runs integration tests.",
            "Provision a secure AWS VPC and containerized application stack using declarative Terraform scripts."
        ]
    }
}

SKILL_ALIASES: Dict[str, str] = {
    "js": "JavaScript", "javascript": "JavaScript", "es6": "JavaScript",
    "ts": "TypeScript", "typescript": "TypeScript",
    "node": "Node.js", "nodejs": "Node.js", "node.js": "Node.js",
    "express": "Express", "expressjs": "Express", "express.js": "Express",
    "rest": "REST APIs", "rest api": "REST APIs", "rest apis": "REST APIs", "restful api": "REST APIs",
    "mongo": "MongoDB", "mongodb": "MongoDB", "mongoose": "MongoDB",
    "sql": "SQL", "mysql": "SQL", "postgres": "SQL", "postgresql": "SQL",
    "redis": "Redis",
    "react": "React", "reactjs": "React", "react.js": "React",
    "html": "HTML5", "html5": "HTML5",
    "css": "CSS3", "css3": "CSS3",
    "tailwind": "Tailwind CSS", "tailwindcss": "Tailwind CSS",
    "responsive": "Responsive Design", "responsive design": "Responsive Design",
    "git": "Git", "github": "Git",
    "docker": "Docker", "kubernetes": "Kubernetes", "k8s": "Kubernetes",
    "ci/cd": "CI/CD", "cicd": "CI/CD", "linux": "Linux", "bash": "Bash",
    "aws": "AWS", "terraform": "Terraform",
    "python": "Python", "pandas": "Pandas", "numpy": "NumPy",
    "scikit-learn": "Scikit-Learn", "sklearn": "Scikit-Learn",
    "machine learning": "Machine Learning", "ml": "Machine Learning",
    "data visualization": "Data Visualization"
}


def normalize_skill(skill: str) -> str:
    if not skill or not isinstance(skill, str):
        return ""
    clean = skill.strip().lower()
    return SKILL_ALIASES.get(clean, skill.strip().title())


def analyze_skill_gap(student_skills: List[str], target_role: str) -> Dict[str, Any]:
    matched_role_key = None
    for key in ROLE_TAXONOMY:
        if key.lower() == target_role.strip().lower():
            matched_role_key = key
            break

    if not matched_role_key:
        valid_roles = list(ROLE_TAXONOMY.keys())
        raise ValueError(f"Invalid target role '{target_role}'. Supported roles: {', '.join(valid_roles)}")

    role = ROLE_TAXONOMY[matched_role_key]
    normalized_student = {normalize_skill(s).lower() for s in student_skills if s}

    matched_skills = []
    missing_skills = []
    recommendations = []

    for req_skill in role["required_skills"]:
        if req_skill.lower() in normalized_student:
            matched_skills.append(req_skill)
        else:
            missing_skills.append(req_skill)
            rec = role["recommendations"].get(req_skill)
            if rec:
                recommendations.append(rec)

    total_req = len(role["required_skills"])
    readiness_score = round((len(matched_skills) / total_req) * 100) if total_req > 0 else 0

    status = "Early Foundation"
    if readiness_score >= 80:
        status = "Job Ready"
    elif readiness_score >= 50:
        status = "Progressing Well"

    if not missing_skills:
        recommendations.append(
            f"Exceptional profile! You have acquired 100% of the core competencies for {role['title']}."
        )

    return {
        "targetRole": role["title"],
        "description": role["description"],
        "readinessScore": readinessScore if 'readinessScore' in locals() else readiness_score,
        "status": status,
        "totalRequired": total_req,
        "matchedCount": len(matched_skills),
        "missingCount": len(missing_skills),
        "matchedSkills": matched_skills,
        "missingSkills": missing_skills,
        "recommendations": recommendations,
        "suggestedProjects": role.get("suggested_projects", [])
    }


def get_taxonomy_roles() -> List[Dict[str, Any]]:
    return [
        {
            "title": role["title"],
            "description": role["description"],
            "requiredSkillsCount": len(role["required_skills"]),
            "requiredSkills": role["required_skills"]
        }
        for role in ROLE_TAXONOMY.values()
    ]
