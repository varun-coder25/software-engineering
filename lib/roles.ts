export const APP_ROLES = ["student", "admin", "employer"] as const;
export const PUBLIC_SIGNUP_ROLES = ["student", "employer"] as const;

export type AppRole = (typeof APP_ROLES)[number];
export type PublicSignupRole = (typeof PUBLIC_SIGNUP_ROLES)[number];

export function normalizeRole(role: unknown): AppRole {
  if (typeof role !== "string") {
    return "student";
  }

  const normalized = role.toLowerCase();

  if (APP_ROLES.includes(normalized as AppRole)) {
    return normalized as AppRole;
  }

  return "student";
}

export function getDashboardRoute(role: AppRole) {
  switch (role) {
    case "admin":
      return "/dashboard/admin";
    case "employer":
      return "/dashboard/employer";
    case "student":
    default:
      return "/dashboard/student";
  }
}

export function getRoleLabel(role: AppRole) {
  switch (role) {
    case "admin":
      return "College Authority";
    case "employer":
      return "Employer";
    case "student":
    default:
      return "Student";
  }
}

export function getRoleEyebrow(role: AppRole) {
  switch (role) {
    case "admin":
      return "Institution Access";
    case "employer":
      return "Employer Access";
    case "student":
    default:
      return "Student Access";
  }
}

export function getRoleLoginTitle(role: AppRole) {
  switch (role) {
    case "admin":
      return "Login to the admin control desk";
    case "employer":
      return "Login to the employer verification portal";
    case "student":
    default:
      return "Login to the student workspace";
  }
}

export function getRoleLoginSubtitle(role: AppRole) {
  switch (role) {
    case "admin":
      return "Only authorized college authorities can review submissions, approve certificates, and anchor verified hashes on-chain.";
    case "employer":
      return "Access verified student records, academic summaries, and blockchain proof links from one hiring-ready portal.";
    case "student":
    default:
      return "Access your academic dashboard, certificate upload workspace, and grade calculators.";
  }
}
