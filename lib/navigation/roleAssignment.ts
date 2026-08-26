export type AssignableRole = {
  id: string;
  code: string;
  name: string;
};

const SUPER_ADMIN = "super-user";
const OWNER = "owner";
const MANAGER = "manager";

export function normalizeRoleCode(code: string | null | undefined) {
  return String(code || "").trim().toLowerCase();
}

export function canAssignRole(
  actorRoleCode: string | null | undefined,
  targetRoleCode: string | null | undefined,
) {
  const actor = normalizeRoleCode(actorRoleCode);
  const target = normalizeRoleCode(targetRoleCode);

  if (actor === SUPER_ADMIN) return true;

  if (actor === OWNER) {
    return target === MANAGER || ![SUPER_ADMIN, OWNER, MANAGER].includes(target);
  }

  if (actor === MANAGER) {
    return ![SUPER_ADMIN, OWNER, MANAGER].includes(target);
  }

  return false;
}

export function getAssignableRoles(
  actorRoleCode: string | null | undefined,
  roles: AssignableRole[],
) {
  return roles.filter((role) =>
    canAssignRole(actorRoleCode, role.code),
  );
}
