export function setLocalStorageData(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalStorageData(key: string) {
  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
  return null;
}
