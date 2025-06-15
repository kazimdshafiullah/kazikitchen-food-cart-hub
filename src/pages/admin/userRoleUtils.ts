
export const getRoleDisplayName = (role: string) => {
  const roleNames = {
    admin: "Admin",
    manager: "Manager",
    kitchen: "Kitchen Staff",
    rider: "Delivery Rider",
  };
  return roleNames[role as keyof typeof roleNames] || role;
};
