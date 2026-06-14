export const getAvatarUrl = (avatarUrl?: string | null, username?: string | null): string => {
  if (avatarUrl) return avatarUrl;
  const seed = encodeURIComponent(username?.trim() || 'anonymous');
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};
