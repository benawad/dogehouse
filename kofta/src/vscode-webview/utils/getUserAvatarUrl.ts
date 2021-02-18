import normalizeUrl from "normalize-url";
export const getUserAvatarUrl = (avatarUrl: string, size: number = 50) => {
  if (avatarUrl.match(/github/g)) {
    return (
      normalizeUrl(avatarUrl, { removeQueryParameters: ["v"] }) + "?s=" + size
    );
  }

  return avatarUrl;
};
