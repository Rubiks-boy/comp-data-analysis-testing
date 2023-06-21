const WCA_ORIGIN = "https://www.worldcubeassociation.org";

export const wcaApiFetch = ({
  path,
  wcaAccessToken,
  fetchOptions,
}: {
  path: string;
  wcaAccessToken?: string;
  fetchOptions?: unknown;
}) => {
  const baseApiUrl = `${WCA_ORIGIN}/api/v0`;

  return fetch(
    `${baseApiUrl}${path}`,
    Object.assign({}, fetchOptions, {
      headers: new Headers({
        ...(wcaAccessToken
          ? { Authorization: `Bearer ${wcaAccessToken}` }
          : {}),
        "Content-Type": "application/json",
      }),
    })
  ).then((response) => response.json());
};
