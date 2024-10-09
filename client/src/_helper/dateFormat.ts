export function formatDateFromNow(dateString: any) {
  const now: any = new Date();
  const date: any = new Date(dateString);
  const diff = Math.round((now - date) / 1000);

  if (diff < 60) {
    return `${diff} sec ago`;
  } else if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return `${mins} min ago`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hour ago`;
  } else if (diff < 604800) {
    const days = Math.floor(diff / 86400);
    return `${days} day ago`;
  } else {
    return date.toLocaleDateString();
  }
}
