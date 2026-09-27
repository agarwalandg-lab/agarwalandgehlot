import { supabase } from '../lib/supabase';

export type EmployeeProfile = { id: string; employee_code: string; full_name: string; email: string; role: string; department: string; phone: string; active: boolean };
export type EmployeeTask = { id: number; employee_id: string; title: string; description: string; status: 'pending' | 'in_progress' | 'done'; deadline: string | null };
export type Attendance = { id?: number; employee_id: string; attendance_date: string; status: 'present' | 'absent' | 'leave' | 'half_day'; note: string };
export type SalesReport = { id?: number; employee_id: string; report_date: string; total_calls: number; total_units: number; site_visits: number; bookings: number; remarks: string };
export type LeaveRequest = { id?: number; employee_id: string; start_date: string; end_date: string; reason: string; status: 'pending' | 'approved' | 'rejected' };
export type Notice = { id: number; title: string; body: string; audience: string; created_at: string };

export async function loadEmployeeDashboard(userId: string) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const [profile, tasks, attendance, sales, leaves, notices] = await Promise.all([
    supabase.from('employee_profiles').select('*').eq('id', userId).single(),
    supabase.from('employee_tasks').select('*').eq('employee_id', userId).order('deadline'),
    supabase.from('employee_attendance').select('*').eq('employee_id', userId).order('attendance_date', { ascending: false }).limit(60),
    supabase.from('employee_sales').select('*').eq('employee_id', userId).order('report_date', { ascending: false }).limit(30),
    supabase.from('employee_leaves').select('*').eq('employee_id', userId).order('created_at', { ascending: false }),
    supabase.from('employee_notices').select('*').eq('audience', 'all').order('created_at', { ascending: false }),
  ]);
  const error = [profile, tasks, attendance, sales, leaves, notices].find((result) => result.error)?.error;
  if (error) throw error;
  return { profile: profile.data as EmployeeProfile, tasks: (tasks.data || []) as EmployeeTask[], attendance: (attendance.data || []) as Attendance[], sales: (sales.data || []) as SalesReport[], leaves: (leaves.data || []) as LeaveRequest[], notices: (notices.data || []) as Notice[] };
}

export async function saveAttendance(value: Attendance) { if (!supabase) throw new Error('Supabase is not configured.'); const { error } = await supabase.from('employee_attendance').upsert(value, { onConflict: 'employee_id,attendance_date' }); if (error) throw error; }
export async function saveSales(value: SalesReport) { if (!supabase) throw new Error('Supabase is not configured.'); const { error } = await supabase.from('employee_sales').upsert(value, { onConflict: 'employee_id,report_date' }); if (error) throw error; }
export async function saveLeave(value: LeaveRequest) { if (!supabase) throw new Error('Supabase is not configured.'); const { error } = await supabase.from('employee_leaves').insert(value); if (error) throw error; }
export async function updateTask(id: number, status: EmployeeTask['status']) { if (!supabase) throw new Error('Supabase is not configured.'); const { error } = await supabase.from('employee_tasks').update({ status }).eq('id', id); if (error) throw error; }
