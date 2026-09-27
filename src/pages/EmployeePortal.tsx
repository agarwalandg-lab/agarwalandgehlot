import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiCheckCircle, FiClock, FiLogOut, FiSend } from 'react-icons/fi';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { Attendance, EmployeeTask, LeaveRequest, SalesReport, loadEmployeeDashboard, saveAttendance, saveLeave, saveSales, updateTask } from '../data/employeeStore';

const inputClass = 'admin-input w-full px-4 py-3 text-sm';
const today = new Date().toISOString().slice(0, 10);
type Dashboard = Awaited<ReturnType<typeof loadEmployeeDashboard>>;
type Session = Awaited<ReturnType<NonNullable<typeof supabase>['auth']['getSession']>>['data']['session'];

export default function EmployeePortal() {
  const [session, setSession] = useState<Session>(null);
  const [employeeCode, setEmployeeCode] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: auth }) => setSession(auth.session));
    const listener = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.data.subscription.unsubscribe();
  }, []);

  const refresh = async () => {
    if (!session) return;
    setLoading(true);
    try { setData(await loadEmployeeDashboard(session.user.id)); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to load your workspace.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void refresh(); }, [session]);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    try {
      const response = await fetch('/api/employee-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ employeeCode, password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      const { error } = await supabase.auth.setSession(result.session);
      if (error) throw error;
      setMessage('');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Login failed.'); }
    finally { setBusy(false); }
  };

  if (!supabaseConfigured) return <MessageScreen title="Workspace unavailable" text="Supabase is not configured for this private portal." />;
  if (!session) return <LoginScreen busy={busy} code={employeeCode} password={password} message={message} onCode={setEmployeeCode} onPassword={setPassword} onSubmit={login} />;
  if (loading && !data) return <MessageScreen title="Preparing your workspace" text="Loading your A&G employee portal…" />;
  if (!data) return <MessageScreen title="Workspace unavailable" text={message || 'This login is not linked to an employee profile yet.'} onReturn={() => void supabase?.auth.signOut()} />;
  return <EmployeeWorkspace data={data} onRefresh={refresh} onSignOut={() => void supabase?.auth.signOut()} />;
}

function LoginScreen({ busy, code, password, message, onCode, onPassword, onSubmit }: { busy: boolean; code: string; password: string; message: string; onCode: (value: string) => void; onPassword: (value: string) => void; onSubmit: (event: FormEvent) => void }) {
  return <main className="admin-shell relative flex min-h-screen items-center justify-center overflow-hidden p-6">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,hsl(var(--text)_/_0.1),transparent_36rem)]" />
    <div className="absolute left-1/2 top-6 z-10 w-[calc(100%-2rem)] max-w-[1200px] -translate-x-1/2"><div className="portal-nav flex items-center justify-between rounded-full border border-white/20 px-3 py-2"><Wordmark /><span className="px-3 text-[10px] uppercase tracking-[0.24em] text-muted">Private workspace</span></div></div>
    <form onSubmit={onSubmit} className="admin-panel relative w-full max-w-md p-8 md:p-10"><p className="text-xs uppercase tracking-[0.3em] text-muted">A&amp;G Realtors</p><h1 className="mt-3 text-4xl font-display">Employee Portal</h1><p className="mt-3 text-sm leading-relaxed text-muted">Your private space for the day&apos;s work, activity and updates.</p><div className="mt-10 space-y-4"><label className="block text-xs uppercase tracking-widest text-muted">Employee ID<input required autoComplete="username" value={code} onChange={(event) => onCode(event.target.value)} className={`${inputClass} mt-2`} /></label><label className="block text-xs uppercase tracking-widest text-muted">Password<input required type="password" autoComplete="current-password" value={password} onChange={(event) => onPassword(event.target.value)} className={`${inputClass} mt-2`} /></label><button disabled={busy} className="admin-accent mt-3 w-full px-4 py-3 text-xs uppercase tracking-[0.14em]">{busy ? 'Signing in…' : 'Login'}</button></div>{message && <p role="alert" className="mt-4 text-sm text-red-400">{message}</p>}<p className="mt-8 text-center text-xs text-muted">Forgot password? Contact your administrator.</p></form>
  </main>;
}

function MessageScreen({ title, text, onReturn }: { title: string; text: string; onReturn?: () => void }) { return <main className="admin-shell flex min-h-screen items-center justify-center p-6"><section className="admin-panel w-full max-w-lg p-8 text-center"><div className="mx-auto w-fit"><Wordmark /></div><h1 className="mt-7 text-4xl font-display">{title}</h1><p className="mt-4 text-sm leading-relaxed text-muted">{text}</p>{onReturn && <button onClick={onReturn} className="admin-muted-button mt-7 px-5 py-3 text-sm">Return to login</button>}</section></main>; }

function EmployeeWorkspace({ data, onRefresh, onSignOut }: { data: Dashboard; onRefresh: () => Promise<void>; onSignOut: () => void }) {
  const [attendance, setAttendance] = useState<Attendance>({ employee_id: data.profile.id, attendance_date: today, status: 'present', note: '' });
  const [sales, setSales] = useState<SalesReport>({ employee_id: data.profile.id, report_date: today, total_calls: 0, total_units: 0, site_visits: 0, bookings: 0, remarks: '' });
  const [leave, setLeave] = useState<LeaveRequest>({ employee_id: data.profile.id, start_date: today, end_date: today, reason: '', status: 'pending' });
  const [message, setMessage] = useState('');
  const submit = async (action: () => Promise<void>, success: string) => { try { await action(); await onRefresh(); setMessage(success); } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save update.'); } };
  const statusCount = (status: EmployeeTask['status']) => data.tasks.filter((task) => task.status === status).length;
  return <main className="admin-shell min-h-screen"><header className="px-4 pt-4 md:px-6 md:pt-6"><div className="portal-nav mx-auto flex max-w-[1400px] items-center justify-between rounded-full border border-white/20 px-3 py-2"><div className="flex items-center gap-3"><Wordmark /><div className="hidden sm:block"><p className="text-[10px] uppercase tracking-[0.22em] text-muted">Employee workspace</p><p className="font-display text-lg leading-tight">{data.profile.full_name}</p></div></div><button onClick={onSignOut} className="admin-muted-button flex items-center gap-2 px-4 py-2 text-xs"><FiLogOut /> <span className="hidden sm:inline">Sign out</span></button></div></header><div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10"><div className="mb-10 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.25em] text-muted">{data.profile.department} / {data.profile.employee_code}</p><h2 className="mt-3 text-4xl font-display md:text-6xl">Your work, in view.</h2></div><p className="max-w-sm text-sm leading-relaxed text-muted">Tasks, daily attendance, sales activity, leave requests and notices in one private A&amp;G workspace.</p></div><div className="grid gap-4 sm:grid-cols-3"><Metric label="Pending" value={statusCount('pending')} icon={<FiClock />} /><Metric label="In progress" value={statusCount('in_progress')} icon={<FiSend />} /><Metric label="Completed" value={statusCount('done')} icon={<FiCheckCircle />} /></div>{message && <p role="status" className="mt-4 text-sm text-text-primary">{message}</p>}<div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"><Panel label="Assigned work" title="Tasks and deadlines"><div className="space-y-3">{data.tasks.length ? data.tasks.map((task) => <TaskRow key={task.id} task={task} onChange={(status) => void submit(() => updateTask(task.id, status), 'Task status updated.')} />) : <Empty text="No tasks assigned yet." />}</div></Panel><Panel label="A&G noticeboard" title="Latest notices"><div className="space-y-4">{data.notices.length ? data.notices.map((notice) => <article key={notice.id} className="border-b border-stroke pb-4 last:border-0"><p className="font-medium">{notice.title}</p><p className="mt-2 text-sm leading-relaxed text-muted">{notice.body}</p></article>) : <Empty text="No notices right now." />}</div></Panel></div><div className="mt-6 grid gap-6 lg:grid-cols-3"><Panel label="Daily record" title="Mark attendance"><div className="space-y-3"><input type="date" value={attendance.attendance_date} onChange={(event) => setAttendance({ ...attendance, attendance_date: event.target.value })} className={inputClass} /><select value={attendance.status} onChange={(event) => setAttendance({ ...attendance, status: event.target.value as Attendance['status'] })} className={inputClass}><option value="present">Present</option><option value="half_day">Half day</option><option value="absent">Absent</option><option value="leave">Leave</option></select><input value={attendance.note} onChange={(event) => setAttendance({ ...attendance, note: event.target.value })} placeholder="Note" className={inputClass} /><button onClick={() => void submit(() => saveAttendance(attendance), 'Attendance saved.')} className="admin-accent w-full px-4 py-3 text-xs uppercase tracking-[0.14em]">Save attendance</button></div></Panel><Panel label="Sales activity" title="Daily sales report" className="lg:col-span-2"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><input type="date" value={sales.report_date} onChange={(event) => setSales({ ...sales, report_date: event.target.value })} className={inputClass} /><NumberInput label="Calls" value={sales.total_calls} onChange={(value) => setSales({ ...sales, total_calls: value })} /><NumberInput label="Units" value={sales.total_units} onChange={(value) => setSales({ ...sales, total_units: value })} /><NumberInput label="Visits" value={sales.site_visits} onChange={(value) => setSales({ ...sales, site_visits: value })} /><NumberInput label="Bookings" value={sales.bookings} onChange={(value) => setSales({ ...sales, bookings: value })} /></div><textarea value={sales.remarks} onChange={(event) => setSales({ ...sales, remarks: event.target.value })} placeholder="Remarks" className={`${inputClass} mt-3 min-h-24`} /><button onClick={() => void submit(() => saveSales(sales), 'Sales report saved.')} className="admin-accent mt-3 px-5 py-3 text-xs uppercase tracking-[0.14em]">Save sales report</button></Panel></div><div className="mt-6 grid gap-6 lg:grid-cols-2"><Panel label="Attendance history" title="Recent days"><div className="space-y-2">{data.attendance.length ? data.attendance.slice(0, 10).map((item) => <div key={item.attendance_date} className="flex items-center justify-between border-b border-stroke py-3 text-sm"><span>{item.attendance_date}</span><span className="text-muted">{item.status}</span></div>) : <Empty text="No attendance records yet." />}</div></Panel><Panel label="Time away" title="Request leave"><div className="grid gap-3 sm:grid-cols-2"><input type="date" value={leave.start_date} onChange={(event) => setLeave({ ...leave, start_date: event.target.value })} className={inputClass} /><input type="date" value={leave.end_date} onChange={(event) => setLeave({ ...leave, end_date: event.target.value })} className={inputClass} /></div><textarea value={leave.reason} onChange={(event) => setLeave({ ...leave, reason: event.target.value })} placeholder="Reason for leave" className={`${inputClass} mt-3 min-h-24`} /><button onClick={() => void submit(() => saveLeave(leave), 'Leave request submitted.')} className="admin-accent mt-3 px-5 py-3 text-xs uppercase tracking-[0.14em]">Submit leave request</button><div className="mt-5 space-y-2">{data.leaves.slice(0, 4).map((item) => <p key={item.id} className="flex justify-between border-b border-stroke py-2 text-sm"><span>{item.start_date} to {item.end_date}</span><span className="text-muted">{item.status}</span></p>)}</div></Panel></div></div></main>;
}

function Wordmark() { return <Link to="/" aria-label="A&G Realtors home" className="flex h-10 w-10 items-center justify-center overflow-hidden hover:scale-105 transition-transform"><img src="/logos/ag-logo.png" alt="A&G Logo" className="w-full h-full object-contain" /></Link>; }
function Panel({ label, title, children, className = '' }: { label: string; title: string; children: ReactNode; className?: string }) { return <section className={`admin-panel p-6 ${className}`}><p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p><h2 className="mt-2 text-3xl font-display">{title}</h2><div className="mt-5">{children}</div></section>; }
function Metric({ label, value, icon }: { label: string; value: number; icon: ReactNode }) { return <div className="admin-panel flex items-center justify-between p-5"><div><p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p><strong className="mt-3 block text-3xl font-display">{value}</strong></div><span className="text-text-primary">{icon}</span></div>; }
function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <input type="number" min="0" aria-label={label} placeholder={label} value={value} onChange={(event) => onChange(Number(event.target.value))} className={inputClass} />; }
function Empty({ text }: { text: string }) { return <p className="py-8 text-sm text-muted">{text}</p>; }
function TaskRow({ task, onChange }: { task: EmployeeTask; onChange: (status: EmployeeTask['status']) => void }) { return <div className="border-b border-stroke pb-4 last:border-0"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-medium">{task.title}</h3><p className="mt-1 text-sm text-muted">{task.description}</p></div><select value={task.status} onChange={(event) => onChange(event.target.value as EmployeeTask['status'])} className="admin-input px-3 py-2 text-xs"><option value="pending">Pending</option><option value="in_progress">In progress</option><option value="done">Done</option></select></div><p className="mt-3 flex items-center gap-2 text-xs uppercase tracking-wider text-muted"><FiCalendar /> Deadline: {task.deadline || 'Not set'}</p></div>; }
