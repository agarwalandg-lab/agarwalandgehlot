import { FormEvent, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiPlus, FiRefreshCw, FiSave, FiSend } from "react-icons/fi";
import { supabase } from "../lib/supabase";

type Profile = {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  active: boolean;
};
type Task = {
  id: number;
  employee_id: string;
  title: string;
  description: string;
  status: string;
  deadline: string | null;
};
type Leave = {
  id: number;
  employee_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
};
type Sales = {
  employee_id: string;
  report_date: string;
  total_calls: number;
  total_units: number;
  site_visits: number;
  bookings: number;
  remarks: string;
};
type PortalData = {
  profiles: Profile[];
  tasks: Task[];
  attendance: {
    employee_id: string;
    attendance_date: string;
    status: string;
  }[];
  sales: Sales[];
  leaves: Leave[];
  notices: { id: number; title: string; body: string }[];
};
const inputClass = "admin-input w-full px-3 py-3 text-sm";
const emptyPortalData: PortalData = {
  profiles: [],
  tasks: [],
  attendance: [],
  sales: [],
  leaves: [],
  notices: [],
};

export default function EmployeeManagement() {
  const [data, setData] = useState<PortalData | null>(null);
  const [selected, setSelected] = useState<Profile | null>(null);
  const [message, setMessage] = useState("");
  const [createdLogin, setCreatedLogin] = useState<{ employeeCode: string; fullName: string; email: string; password: string; portalPath: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [account, setAccount] = useState({
    fullName: "",
    employeeCode: "",
    email: "",
    password: "",
    department: "General",
    role: "employee",
  });
  const [task, setTask] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [notice, setNotice] = useState({ title: "", body: "" });

  const load = async () => {
    if (!supabase) return;
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;
    const response = await fetch("/api/employees", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    setData(result);
    setSelected((current) => current || result.profiles[0] || null);
  };
  useEffect(() => {
    void load()
      .catch((error) =>
        setMessage(
          error instanceof Error
            ? `Feature preview mode: ${error.message}`
            : "Feature preview mode: employee records are not connected yet.",
        ),
      )
      .then(() => setData((current) => current || emptyPortalData))
      .finally(() => setLoading(false));
  }, []);

  const post = async (payload: unknown, success: string) => {
    if (!supabase) {
      setMessage("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the app.");
      return null;
    }
    setBusy(true);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error("Your admin session has expired. Sign in again.");
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (result.profile) {
        setData((current) => current ? {
          ...current,
          profiles: [...current.profiles.filter((profile) => profile.id !== result.profile.id), result.profile].sort((a, b) => a.full_name.localeCompare(b.full_name)),
        } : current);
        setSelected((current) => current || result.profile);
      }
      setMessage(success);
      try {
        await load();
      } catch (refreshError) {
        setMessage(`${success} The list will update after you click Refresh.`);
        console.error("Employee data refresh failed:", refreshError);
      }
      return result;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Operation failed.");
      return null;
    } finally {
      setBusy(false);
    }
  };
  const createAccount = async (event: FormEvent) => {
    event.preventDefault();
    const result = await post(
      { action: "create-employee", ...account },
      "Employee account created.",
    );
    if (result?.employee) {
      setCreatedLogin(result.employee);
      setAccount({ fullName: "", employeeCode: "", email: "", password: "", department: "General", role: "employee" });
    }
  };
  const refreshEmployees = async () => {
    try {
      setLoading(true);
      await load();
      setMessage("Employee list refreshed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not refresh employee records.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <section className="admin-panel mt-5 p-6 text-sm text-muted">
        Loading employee records...
      </section>
    );
  if (!data) return null;
  const selectedTasks = selected
    ? data.tasks.filter((item) => item.employee_id === selected.id)
    : [];
  const selectedAttendance = selected
    ? data.attendance.filter((item) => item.employee_id === selected.id)
    : [];
  const selectedSales = selected
    ? data.sales.filter((item) => item.employee_id === selected.id)
    : [];
  const selectedLeaves = selected
    ? data.leaves.filter((item) => item.employee_id === selected.id)
    : [];

  return (
    <div className="mt-5 space-y-5">
      {message && <p role="status" className={`rounded-lg border px-4 py-3 text-sm ${message.startsWith("Feature preview mode:") || message.includes("expired") || message.includes("not configured") ? "border-red-500/40 bg-red-500/10 text-red-300" : "border-accent/30 bg-accent/10 text-accent"}`}>{message}</p>}
      <div className="grid gap-5 lg:grid-cols-[330px_1fr]">
        <section className="admin-panel p-5">
          <p className="text-xs uppercase tracking-widest text-muted">People</p>
          <div className="mt-2 flex items-center justify-between gap-3"><h2 className="text-3xl font-display">Employees</h2><button type="button" onClick={() => void refreshEmployees()} className="admin-muted-button flex items-center gap-2 px-3 py-2 text-xs" aria-label="Refresh employee list"><FiRefreshCw /> Refresh</button></div>
          <div className="mt-5 space-y-1">
            {data.profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => setSelected(profile)}
                className={`block w-full rounded-xl p-3 text-left ${selected?.id === profile.id ? "bg-surface text-text-primary" : "text-muted"}`}
              >
                <span className="block">{profile.full_name}</span>
                <span className="mt-1 block text-xs">
                  {profile.employee_code} / {profile.department}
                </span>
              </button>
            ))}
            {!data.profiles.length && <p className="mt-5 border-t border-stroke pt-4 text-sm text-muted">No employee records yet. Use Generate employee login below to create the first account.</p>}
          </div>
        </section>
        <section className="admin-panel p-5">
          <p className="text-xs uppercase tracking-widest text-muted">
            Selected employee
          </p>
          <h2 className="mt-2 text-3xl font-display">
            {selected?.full_name || "Select an employee"}
          </h2>
          {selected && (
            <EmployeeDetail
              profile={selected}
              tasks={selectedTasks}
              attendance={selectedAttendance}
              sales={selectedSales}
              leaves={selectedLeaves}
              onLeave={(id, status) =>
                void post(
                  { action: "update-leave", id, status },
                  `Leave ${status}.`,
                )
              }
              onProfile={(record) =>
                void post(
                  { action: "update-profile", id: selected.id, record },
                  "Employee profile updated.",
                )
              }
              onTask={(id, record) =>
                void post(
                  { action: "update-task", id, record },
                  "Task updated.",
                )
              }
              onDeleteTask={(id) =>
                void post({ action: "delete-task", id }, "Task deleted.")
              }
            />
          )}
        </section>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <form onSubmit={createAccount} className="admin-panel p-5">
          <p className="text-xs uppercase tracking-widest text-muted">
            Account provisioning
          </p>
          <h2 className="mt-2 text-3xl font-display">
            Generate employee login
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <input
              required
              placeholder="Full name"
              value={account.fullName}
              onChange={(event) =>
                setAccount({ ...account, fullName: event.target.value })
              }
              className={inputClass}
            />
            <input
              required
              placeholder="Employee ID"
              value={account.employeeCode}
              onChange={(event) =>
                setAccount({ ...account, employeeCode: event.target.value })
              }
              className={inputClass}
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={account.email}
              onChange={(event) =>
                setAccount({ ...account, email: event.target.value })
              }
              className={inputClass}
            />
            <input
              required
              minLength={8}
              placeholder="Temporary password"
              value={account.password}
              onChange={(event) =>
                setAccount({ ...account, password: event.target.value })
              }
              className={inputClass}
            />
            <input
              placeholder="Department"
              value={account.department}
              onChange={(event) =>
                setAccount({ ...account, department: event.target.value })
              }
              className={inputClass}
            />
            <select
              value={account.role}
              onChange={(event) =>
                setAccount({ ...account, role: event.target.value })
              }
              className={inputClass}
            >
              <option value="employee">Employee</option>
              <option value="sales">Sales</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <button
            disabled={busy}
            className="admin-accent mt-4 flex items-center gap-2 px-4 py-3 text-sm"
          >
            <FiPlus /> Generate login
          </button>
        </form>
        <section className="admin-panel p-5">
          <p className="text-xs uppercase tracking-widest text-muted">
            Management actions
          </p>
          <h2 className="mt-2 text-3xl font-display">Assign and announce</h2>
          <div className="mt-5 space-y-3">
            <input
              placeholder="Task title"
              value={task.title}
              onChange={(event) =>
                setTask({ ...task, title: event.target.value })
              }
              className={inputClass}
            />
            <textarea
              placeholder="Task description"
              value={task.description}
              onChange={(event) =>
                setTask({ ...task, description: event.target.value })
              }
              className={`${inputClass} min-h-20`}
            />
            <div className="flex gap-3">
              <input
                type="date"
                value={task.deadline}
                onChange={(event) =>
                  setTask({ ...task, deadline: event.target.value })
                }
                className={inputClass}
              />
              <button
                type="button"
                disabled={!selected || busy}
                onClick={() =>
                  void post(
                    {
                      action: "task",
                      record: {
                        ...task,
                        employee_id: selected?.id,
                        status: "pending",
                      },
                    },
                    "Task assigned.",
                  )
                }
                className="admin-accent shrink-0 px-4"
              >
                <FiSave />
              </button>
            </div>
            <input
              placeholder="Notice title"
              value={notice.title}
              onChange={(event) =>
                setNotice({ ...notice, title: event.target.value })
              }
              className={inputClass}
            />
            <textarea
              placeholder="Notice body"
              value={notice.body}
              onChange={(event) =>
                setNotice({ ...notice, body: event.target.value })
              }
              className={`${inputClass} min-h-20`}
            />
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void post(
                  { action: "notice", record: notice },
                  "Notice published.",
                )
              }
              className="admin-muted-button flex items-center gap-2 px-4 py-3 text-sm"
            >
              <FiSend /> Publish notice
            </button>
          </div>
        </section>
      </div>
      <AdminActivityEditor
        employee={selected}
        employees={data.profiles}
        attendance={data.attendance}
        sales={selectedSales}
        busy={busy}
        post={post}
      />
      {createdLogin && <section className="admin-panel border-[#5d8fc8] p-6"><p className="text-xs uppercase tracking-widest text-muted">Login created successfully</p><h2 className="mt-2 text-3xl font-display">{createdLogin.fullName}</h2><div className="mt-5 grid gap-4 sm:grid-cols-3"><Credential label="Employee ID" value={createdLogin.employeeCode} /><Credential label="Email" value={createdLogin.email} /><Credential label="Password" value={createdLogin.password} /></div><p className="mt-5 text-sm text-muted">Employee dashboard: <strong className="text-text-primary">{createdLogin.portalPath}</strong></p><button type="button" onClick={() => setCreatedLogin(null)} className="admin-muted-button mt-4 px-4 py-2 text-xs">Close credentials</button></section>}
    </div>
  );
}

function AdminActivityEditor({
  employee,
  employees,
  attendance,
  sales: salesReports,
  busy,
  post,
}: {
  employee: Profile | null;
  employees: Profile[];
  attendance: { employee_id: string; attendance_date: string; status: string }[];
  sales: Sales[];
  busy: boolean;
  post: (payload: unknown, success: string) => Promise<void>;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [attendanceDate, setAttendanceDate] = useState(today);
  const [attendanceStatus, setAttendanceStatus] = useState("present");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(`${today}T00:00:00`));
  const [rosterOpen, setRosterOpen] = useState(false);
  const [rosterStatuses, setRosterStatuses] = useState<Record<string, string>>({});
  const [salesDate, setSalesDate] = useState(today);
  const [sales, setSales] = useState({
    total_calls: 0,
    total_units: 0,
    site_visits: 0,
    bookings: 0,
    remarks: "",
  });
  if (!employee) return null;
  const attendanceByDate = new Map(attendance.filter((item) => item.employee_id === employee?.id).map((item) => [item.attendance_date, item.status]));
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const monthLabel = calendarMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayCells = Array.from({ length: firstWeekday + daysInMonth }, (_, index) => {
    if (index < firstWeekday) return null;
    const day = index - firstWeekday + 1;
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  });
  const selectAttendanceDay = (date: string) => {
    setAttendanceDate(date);
    setAttendanceStatus(attendanceByDate.get(date) || "present");
    setRosterStatuses(Object.fromEntries(employees.map((profile) => [profile.id, attendance.find((item) => item.employee_id === profile.id && item.attendance_date === date)?.status || "present"])));
    setRosterOpen(true);
  };
  const attendanceStyle = (status?: string) => ({
    present: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
    absent: "border-red-400/40 bg-red-400/10 text-red-200",
    leave: "border-amber-400/40 bg-amber-400/10 text-amber-200",
    half_day: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  }[status || ""] || "border-stroke text-muted");
  return (
    <>
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="admin-panel p-5">
        <p className="text-xs uppercase tracking-widest text-muted">
          Packet 1 / Attendance
        </p>
        <h2 className="mt-2 text-3xl font-display">Attendance calendar</h2>
        <div className="mt-5 rounded-xl border border-stroke p-3">
          <div className="flex items-center justify-between gap-3"><button type="button" onClick={() => setCalendarMonth(new Date(year, month - 1, 1))} className="admin-muted-button p-2" aria-label="Previous month"><FiChevronLeft /></button><p className="text-sm font-medium">{monthLabel}</p><button type="button" onClick={() => setCalendarMonth(new Date(year, month + 1, 1))} className="admin-muted-button p-2" aria-label="Next month"><FiChevronRight /></button></div>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-muted">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day}>{day}</span>)}</div>
          <div className="mt-2 grid grid-cols-7 gap-1">{dayCells.map((date, index) => date ? <button key={date} type="button" onClick={() => selectAttendanceDay(date)} className={`aspect-square rounded-lg border text-xs transition ${attendanceStyle(attendanceByDate.get(date))} ${attendanceDate === date ? "ring-2 ring-accent ring-offset-2 ring-offset-surface" : "hover:border-accent/60"}`} aria-label={`Select ${date}`}><span>{Number(date.slice(-2))}</span></button> : <span key={`empty-${index}`} />)}</div>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <p className="admin-input flex items-center px-3 py-3 text-sm">Selected: {attendanceDate}</p>
          <select value={attendanceStatus} onChange={(event) => setAttendanceStatus(event.target.value)} className={inputClass}>
            <option value="present">Present</option><option value="half_day">Half day</option><option value="absent">Absent</option><option value="leave">Leave</option>
          </select>
        </div>
        <button
          disabled={busy}
          onClick={() =>
            void post(
              {
                action: "attendance",
                record: {
                  employee_id: employee.id,
                  attendance_date: attendanceDate,
                  status: attendanceStatus,
                  note: "Marked by administrator",
                },
              },
              "Attendance updated.",
            )
          }
          className="admin-accent mt-4 flex items-center gap-2 px-4 py-3 text-sm"
        >
          <FiSave /> Save attendance
        </button>
        <div className="mt-5 space-y-2">
          {attendance.filter((item) => item.employee_id === employee.id).slice(0, 7).map((item) => (
            <p
              key={item.attendance_date}
              className="flex justify-between border-b border-stroke py-2 text-sm"
            >
              <span>{item.attendance_date}</span>
              <span className="text-muted">{item.status}</span>
            </p>
          ))}
        </div>
      </section>
      <section className="admin-panel p-5">
        <p className="text-xs uppercase tracking-widest text-muted">
          Packet 1 / Sales
        </p>
        <h2 className="mt-2 text-3xl font-display">Record daily activity</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <input
            type="date"
            value={salesDate}
            onChange={(event) => setSalesDate(event.target.value)}
            className={inputClass}
          />
          <input
            type="number"
            min="0"
            placeholder="Total calls"
            value={sales.total_calls}
            onChange={(event) =>
              setSales({ ...sales, total_calls: Number(event.target.value) })
            }
            className={inputClass}
          />
          <input
            type="number"
            min="0"
            placeholder="Total units"
            value={sales.total_units}
            onChange={(event) =>
              setSales({ ...sales, total_units: Number(event.target.value) })
            }
            className={inputClass}
          />
          <input
            type="number"
            min="0"
            placeholder="Site visits"
            value={sales.site_visits}
            onChange={(event) =>
              setSales({ ...sales, site_visits: Number(event.target.value) })
            }
            className={inputClass}
          />
          <input
            type="number"
            min="0"
            placeholder="Bookings"
            value={sales.bookings}
            onChange={(event) =>
              setSales({ ...sales, bookings: Number(event.target.value) })
            }
            className={inputClass}
          />
        </div>
        <textarea
          placeholder="Remarks"
          value={sales.remarks}
          onChange={(event) =>
            setSales({ ...sales, remarks: event.target.value })
          }
          className={`${inputClass} mt-3 min-h-20`}
        />
        <button
          disabled={busy}
          onClick={() =>
            void post(
              {
                action: "sales",
                record: {
                  employee_id: employee.id,
                  report_date: salesDate,
                  ...sales,
                },
              },
              "Sales activity updated.",
            )
          }
          className="admin-accent mt-3 flex items-center gap-2 px-4 py-3 text-sm"
        >
          <FiSave /> Save sales report
        </button>
        <div className="mt-5 space-y-2">
          {salesReports.slice(0, 5).map((item) => (
            <p
              key={item.report_date}
              className="flex justify-between border-b border-stroke py-2 text-sm"
            >
              <span>{item.report_date}</span>
              <span className="text-muted">
                {item.total_calls} calls / {item.total_units} units
              </span>
            </p>
          ))}
        </div>
      </section>
    </div>
    {rosterOpen && <div role="dialog" aria-modal="true" aria-label="Daily attendance roster" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"><section className="admin-panel max-h-[85vh] w-full max-w-3xl overflow-y-auto p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-muted">Daily attendance</p><h2 className="mt-2 text-3xl font-display">{attendanceDate}</h2><p className="mt-2 text-sm text-muted">Mark the attendance status for every employee.</p></div><button type="button" onClick={() => setRosterOpen(false)} className="admin-muted-button px-3 py-2 text-xs">Close</button></div><div className="mt-6 space-y-3">{employees.map((profile) => <div key={profile.id} className="flex flex-col gap-3 rounded-xl border border-stroke p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{profile.full_name}</p><p className="mt-1 text-xs text-muted">{profile.employee_code} · {profile.department}</p></div><div className="flex items-center gap-2"><select value={rosterStatuses[profile.id] || "present"} onChange={(event) => setRosterStatuses((current) => ({ ...current, [profile.id]: event.target.value }))} className="admin-input min-w-32 px-3 py-2 text-sm"><option value="present">Present</option><option value="absent">Absent</option><option value="half_day">Half day</option><option value="leave">Leave</option></select><button type="button" disabled={busy} onClick={() => void post({ action: "attendance", record: { employee_id: profile.id, attendance_date: attendanceDate, status: rosterStatuses[profile.id] || "present", note: "Marked by administrator" } }, `${profile.full_name}'s attendance updated.`)} className="admin-accent px-3 py-2 text-xs"><FiSave /></button></div></div>)}</div>{employees.length > 0 && <button type="button" disabled={busy} onClick={() => void post({ action: "attendance-bulk", records: employees.map((profile) => ({ employee_id: profile.id, attendance_date: attendanceDate, status: rosterStatuses[profile.id] || "present", note: "Marked by administrator" })) }, "Attendance submitted for all employees.")} className="admin-accent mt-5 flex w-full items-center justify-center gap-2 px-4 py-3 text-sm"><FiSave /> Submit attendance</button>}{!employees.length && <p className="mt-6 text-sm text-muted">Create an employee account before marking attendance.</p>}</section></div>}
    </>
  );
}

function EmployeeDetail({
  profile,
  tasks,
  attendance,
  sales,
  leaves,
  onLeave,
  onProfile,
  onTask,
  onDeleteTask,
}: {
  profile: Profile;
  tasks: Task[];
  attendance: { attendance_date: string; status: string }[];
  sales: Sales[];
  leaves: Leave[];
  onLeave: (id: number, status: "approved" | "rejected") => void;
  onProfile: (record: Partial<Profile>) => void;
  onTask: (id: number, record: Partial<Task>) => void;
  onDeleteTask: (id: number) => void;
}) {
  return (
    <div>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <Info label="Email" value={profile.email} />
        <Info label="Role" value={profile.role} />
        <Info label="Phone" value={profile.phone || "Not added"} />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Metric label="Tasks" value={tasks.length} />
        <Metric label="Attendance" value={attendance.length} />
        <Metric label="Leave requests" value={leaves.length} />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" onClick={() => onProfile({ active: !profile.active })} className="admin-muted-button px-3 py-2 text-xs">{profile.active ? "Deactivate employee" : "Activate employee"}</button>
        <button type="button" onClick={() => onProfile({ department: profile.department === "General" ? "Sales" : "General" })} className="admin-muted-button px-3 py-2 text-xs">Toggle department</button>
      </div>
      <DataBlock title="Assigned tasks">
        {tasks.length ? (
          tasks.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b border-stroke py-3 text-sm"
            >
              <span>{item.title}</span>
              <span className="flex items-center gap-2 text-muted"><select value={item.status} onChange={(event) => onTask(item.id, { status: event.target.value })} className="admin-input px-2 py-1 text-xs"><option value="pending">Pending</option><option value="in_progress">In progress</option><option value="done">Done</option></select><span>{item.deadline || "No deadline"}</span><button type="button" onClick={() => onDeleteTask(item.id)} className="admin-muted-button px-2 py-1 text-xs text-red-300">Delete</button></span>
            </div>
          ))
        ) : (
          <Empty />
        )}
      </DataBlock>
      <DataBlock title="Recent sales activity">
        {sales.slice(0, 5).map((item) => (
          <div
            key={item.report_date}
            className="flex justify-between border-b border-stroke py-3 text-sm"
          >
            <span>{item.report_date}</span>
            <span className="text-muted">
              {item.total_calls} calls / {item.total_units} units /{" "}
              {item.bookings} bookings
            </span>
          </div>
        ))}
      </DataBlock>
      <DataBlock title="Leave requests">
        {leaves.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-2 border-b border-stroke py-3 text-sm"
          >
            <span>
              {item.start_date} to {item.end_date}
            </span>
            <span className="flex items-center gap-2 text-muted">
              {item.status}
              {item.status === "pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => onLeave(item.id, "approved")}
                    className="admin-muted-button px-2 py-1 text-xs"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => onLeave(item.id, "rejected")}
                    className="admin-muted-button px-2 py-1 text-xs"
                  >
                    Reject
                  </button>
                </>
              )}
            </span>
          </div>
        ))}
      </DataBlock>
    </div>
  );
}
function DataBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <p className="text-xs uppercase tracking-widest text-muted">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
      <p className="mt-1 truncate">{value}</p>
    </div>
  );
}
function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-stroke p-4">
      <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
      <strong className="mt-2 block text-2xl font-display">{value}</strong>
    </div>
  );
}
function Empty() {
  return <p className="py-3 text-sm text-muted">No records yet.</p>;
}
function Credential({ label, value }: { label: string; value: string }) { return <div className="border border-stroke p-4"><p className="text-xs uppercase tracking-widest text-muted">{label}</p><p className="mt-2 break-all text-sm text-text-primary">{value}</p></div>; }
