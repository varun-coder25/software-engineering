export const APP_ROLES = ["student", "admin", "employer"] as const;

export type AppRole = (typeof APP_ROLES)[number];

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
