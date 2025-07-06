export const joinPaths = (...paths: string[]) => {
  return paths
    .map((path, i) => {
      if (i === 0) {
        return path.trim().replace(/[/]*$/g, "");
      } else {
        return path.trim().replace(/(^[/]*|[/]*$)/g, "");
      }
    })
    .filter((path) => path.length > 0)
    .join("/");
};
