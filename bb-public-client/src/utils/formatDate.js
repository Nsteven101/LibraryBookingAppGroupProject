export default function formatDate(date) {
  if (!date) return '';
  // if it’s already a Date, use it; otherwise parse the string
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString();
}
