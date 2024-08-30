import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function GET(req) {
  try {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const usersCol = collection(db, 'users');
    
    // Weekly report
    const weeklyQuery = query(usersCol, where('createdAt', '>=', startOfWeek));
    const weeklySnapshot = await getDocs(weeklyQuery);
    const weeklyCount = weeklySnapshot.size;

    // Monthly report
    const monthlyQuery = query(usersCol, where('createdAt', '>=', startOfMonth));
    const monthlySnapshot = await getDocs(monthlyQuery);
    const monthlyCount = monthlySnapshot.size;

    return new Response(JSON.stringify({ weeklyCount, monthlyCount }), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch analytics', { status: 500 });
  }
}
