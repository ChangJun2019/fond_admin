// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === "undefined" ? localStorage.getItem("gp-cj-scope") : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === "string") {
    return [authority];
  }
  return authority;
}

export function setAuthority(authority) {
  const cjAuthority = typeof authority === "string" ? [authority] : authority;
  return localStorage.setItem("gp-cj-scope", JSON.stringify(cjAuthority));
}
