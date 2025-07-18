export default function getStringFromDateForBack (date: Date): string {
    const day = String(date.getDate());
    const month = String(date.getMonth() + 1);
    const year = date.getFullYear();
    
    return `${year}-${month}-${day}`
}