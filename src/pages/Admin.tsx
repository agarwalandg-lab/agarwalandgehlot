import { FormEvent, useEffect, useState } from "react";
import {
  FiImage,
  FiLogOut,
  FiPlus,
  FiSave,
  FiTrash2,
  FiUpload,
} from "react-icons/fi";
import {
  ManagedProject,
  deleteProject,
  deleteProjectMedia,
  loadProjects,
  saveProject,
  uploadProjectMedia,
} from "../data/projectStore";
import { projects as defaults } from "../data/projects";
import {
  AboutContent,
  defaultAbout,
  loadAbout,
  saveAbout,
} from "../data/siteStore";
import {
  HomeContent,
  defaultHome,
  loadHome,
  saveHome,
} from "../data/homeStore";
import EmployeeManagement from "../components/EmployeeManagement";
import { supabase, supabaseConfigured } from "../lib/supabase";

const inputClass = "admin-input w-full px-3 py-3 text-sm";
type Session = Awaited<
  ReturnType<NonNullable<typeof supabase>["auth"]["getSession"]>
>["data"]["session"];
const emptyProject = (): ManagedProject => ({
  slug: "new-project",
  title: "New project",
  type: "Residential",
  image: "",
  location: "",
  category: "",
  status: "Draft",
  configurations: "",
  description: "",
  overview: "",
  highlights: [],
  facts: [],
  sizes: [],
  amenities: [],
  rera: "",
  developer: "",
  promoter: "",
  possession: "",
  price: "Price on Request",
  considerations: [],
  bestSuitedFor: "",
  similar: [],
  seo: {
    title: "",
    description: "",
    primaryKeyword: "",
    secondaryKeywords: [],
  },
  faqs: [],
  gallery: [],
  video: "",
});

export default function Admin() {
  const [session, setSession] = useState<Session>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState<ManagedProject[]>([]);
  const [current, setCurrent] = useState<ManagedProject | null>(null);
  const [about, setAbout] = useState<AboutContent>(defaultAbout);
  const [home, setHome] = useState<HomeContent>(defaultHome);
  const [tab, setTab] = useState<
    "projects" | "website" | "about" | "employees"
  >("projects");
  const [advanced, setAdvanced] = useState(false);
  const [json, setJson] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const auth = supabase.auth.onAuthStateChange((_event, next) =>
      setSession(next),
    );
    return () => auth.data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session) return;
    Promise.all([loadProjects(), loadAbout()]).then(([items, content]) => {
      setProjects(items);
      setAbout(content);
      choose(items[0] || null);
    });
  }, [session]);

  const choose = (project: ManagedProject | null) => {
    setCurrent(project);
    setJson(project ? JSON.stringify(project, null, 2) : "");
    setMessage("");
  };
  const update = (key: keyof ManagedProject, value: string) =>
    setCurrent((project) => (project ? { ...project, [key]: value } : project));
  const login = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setMessage(error?.message || "Signed in.");
    setBusy(false);
  };

  const upload = async (file: File, aboutMedia = false) => {
    setBusy(true);
    setMessage(`Uploading ${file.name}...`);
    try {
      const url = await uploadProjectMedia(file);
      if (aboutMedia)
        setAbout((value) => ({
          ...value,
          ...(file.type.startsWith("video/")
            ? { heroVideo: url }
            : { heroImage: url }),
        }));
      else
        setCurrent((project) =>
          project
            ? {
                ...project,
                image: project.image || url,
                gallery: [
                  ...(project.gallery || []),
                  {
                    src: url,
                    label: file.name,
                    type: file.type.startsWith("video/") ? "video" : "image",
                  },
                ],
              }
            : project,
        );
      setMessage("Upload complete. Save to publish it.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    }
    setBusy(false);
  };
  const uploadMany = async (files: FileList | null) => {
    if (files) for (const file of Array.from(files)) await upload(file);
  };
  const save = async () => {
    try {
      const project = advanced ? (JSON.parse(json) as ManagedProject) : current;
      if (!project?.slug || !project.title)
        throw new Error("Title and slug are required.");
      setBusy(true);
      await saveProject(project);
      setProjects((items) => [
        ...items.filter((item) => item.slug !== project.slug),
        project,
      ]);
      setCurrent(project);
      setMessage("Project saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    }
    setBusy(false);
  };
  const seed = async () => {
    setBusy(true);
    try {
      for (const project of defaults)
        await saveProject(project as ManagedProject);
      const items = await loadProjects();
      setProjects(items);
      choose(items[0] || null);
      setMessage("Catalogue published.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Seed failed.");
    }
    setBusy(false);
  };
  const removeProject = async () => {
    if (
      !current ||
      !window.confirm(`Delete ${current.title}? This cannot be undone.`)
    )
      return;
    setBusy(true);
    try {
      await deleteProject(current.slug);
      const items = projects.filter((item) => item.slug !== current.slug);
      setProjects(items);
      choose(items[0] || null);
      setMessage("Project deleted.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Project deletion failed.",
      );
    }
    setBusy(false);
  };
  const removeMedia = async (src: string) => {
    if (!current || !window.confirm("Delete this image or video?")) return;
    setBusy(true);
    try {
      await deleteProjectMedia(src);
      const gallery = (current.gallery || []).filter(
        (media) => media.src !== src,
      );
      setCurrent({
        ...current,
        gallery,
        image: current.image === src ? gallery[0]?.src || "" : current.image,
      });
      setMessage("Media removed. Click Save to publish the change.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Media deletion failed.",
      );
    }
    setBusy(false);
  };

  if (!supabaseConfigured)
    return (
      <main className="admin-shell min-h-screen p-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-display text-text-primary mb-4">Admin Panel</h1>
          <p className="text-muted mb-6">Supabase is not configured. You can still edit content locally, but changes won't be saved to the database.</p>
          <div className="admin-panel p-6">
            <p className="text-sm text-muted mb-4">To enable full functionality, configure these environment variables:</p>
            <ul className="text-sm text-muted space-y-2">
              <li>• VITE_SUPABASE_URL</li>
              <li>• VITE_SUPABASE_ANON_KEY</li>
            </ul>
          </div>
          <div className="mt-6">
            <button
              onClick={() => {
                setProjects(defaults as ManagedProject[]);
                setAbout(defaultAbout);
                setHome(defaultHome);
                setMessage("Loaded default content for local editing.");
              }}
              className="admin-accent px-4 py-2 text-sm"
            >
              Load Default Content
            </button>
          </div>
          {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}
          {projects.length > 0 && (
            <div className="mt-8">
              <ProjectEditorSimple projects={projects} setProjects={setProjects} />
            </div>
          )}
        </div>
      </main>
    );
  if (!session)
    return (
      <main className="admin-shell flex min-h-screen items-center justify-center p-8">
        <form
          onSubmit={login}
          className="admin-panel w-full max-w-md space-y-4 p-8"
        >
          <p className="text-xs uppercase tracking-widest text-muted">
            A&amp;G private console
          </p>
          <h1 className="text-5xl font-display text-text-primary">
            Admin access
          </h1>
          <input
            required
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
          />
          <button disabled={busy} className="admin-accent w-full p-3">
            Sign in
          </button>
          <p className="text-sm text-amber-300">{message}</p>
        </form>
      </main>
    );
  return (
    <main className="admin-shell min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="flex justify-between pb-7">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">
              A&amp;G content studio
            </p>
            <h1 className="mt-2 text-4xl font-display text-text-primary">
              Good morning, editor.
            </h1>
          </div>
          <button
            title="Sign out"
            onClick={() => supabase?.auth.signOut()}
            className="text-muted hover:text-text-primary"
          >
            <FiLogOut />
          </button>
        </header>
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Projects" value={projects.length} />
          <Stat
            label="Media assets"
            value={projects.reduce(
              (total, item) => total + (item.gallery?.length || 0),
              0,
            )}
          />
          <Stat label="Workspace" value="Live" accent />
        </div>
        <div className="admin-panel mt-5 flex flex-wrap gap-1 p-2">
          <button
            onClick={() => setTab("projects")}
            className={`rounded-xl px-5 py-3 text-sm ${tab === "projects" ? "bg-surface text-text-primary" : "text-muted"}`}
          >
            Projects
          </button>
          <button
            onClick={() => setTab("website")}
            className={`rounded-xl px-5 py-3 text-sm ${tab === "website" ? "bg-surface text-text-primary" : "text-muted"}`}
          >
            Website
          </button>
          <button
            onClick={() => setTab("about")}
            className={`rounded-xl px-5 py-3 text-sm ${tab === "about" ? "bg-surface text-text-primary" : "text-muted"}`}
          >
            About page
          </button>
          <button
            onClick={() => setTab("employees")}
            className={`rounded-xl px-5 py-3 text-sm ${tab === "employees" ? "bg-surface text-text-primary" : "text-muted"}`}
          >
            Employees
          </button>
        </div>
        {tab === "employees" ? (
          <EmployeeManagement />
        ) : tab === "website" ? (
          <HomeEditor />
        ) : tab === "about" ? (
          <AboutEditor
            about={about}
            setAbout={setAbout}
            upload={(file) => void upload(file, true)}
            save={async () => {
              setBusy(true);
              await saveAbout(about);
              setMessage("About page saved.");
              setBusy(false);
            }}
            message={message}
            busy={busy}
          />
        ) : (
          <div className="mt-5 grid gap-5 lg:grid-cols-[280px_1fr]">
            <aside className="admin-panel p-4">
              <div className="flex gap-2">
                <button
                  onClick={() => choose(emptyProject())}
                  className="admin-accent flex-1 p-3 text-sm"
                >
                  <FiPlus className="mr-1 inline" /> New
                </button>
                <button
                  onClick={() => void seed()}
                  className="admin-muted-button px-3 text-xs"
                >
                  Seed
                </button>
              </div>
              <div className="mt-5 space-y-1">
                {projects.map((project) => (
                  <button
                    key={project.slug}
                    onClick={() => choose(project)}
                    className={`block w-full rounded-xl p-3 text-left ${current?.slug === project.slug ? "bg-surface text-text-primary" : "text-muted"}`}
                  >
                    {project.title}
                  </button>
                ))}
              </div>
            </aside>
            <div className="admin-panel p-5 md:p-7">
              <ProjectEditor
                project={current}
                update={update}
                json={json}
                setJson={setJson}
                advanced={advanced}
                setAdvanced={setAdvanced}
                upload={uploadMany}
                save={() => void save()}
                removeProject={() => void removeProject()}
                removeMedia={(src) => void removeMedia(src)}
                busy={busy}
                message={message}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className={`admin-panel p-5 ${accent ? "bg-[#315f91]" : ""}`}>
      <p className="text-xs uppercase tracking-widest text-zinc-500">{label}</p>
      <strong className="mt-4 block text-3xl font-display text-zinc-800">
        {value}
      </strong>
    </div>
  );
}
function ProjectEditor({
  project,
  update,
  json,
  setJson,
  advanced,
  setAdvanced,
  upload,
  save,
  removeProject,
  removeMedia,
  busy,
  message,
}: {
  project: ManagedProject | null;
  update: (key: keyof ManagedProject, value: string) => void;
  json: string;
  setJson: (value: string) => void;
  advanced: boolean;
  setAdvanced: (value: boolean) => void;
  upload: (files: FileList | null) => void;
  save: () => void;
  removeProject: () => void;
  removeMedia: (src: string) => void;
  busy: boolean;
  message: string;
}) {
  if (!project)
    return <p className="p-10 text-zinc-500">Choose a project to edit.</p>;
  const listValue = (value: unknown) =>
    Array.isArray(value) ? value.join("\n") : String(value || "");
  const jsonValue = (value: unknown) =>
    typeof value === "string" ? value : JSON.stringify(value || [], null, 2);
  const field = (
    key: keyof ManagedProject,
    label: string,
    value: string,
    multiline = true,
  ) => (
    <label className="block text-xs uppercase tracking-widest text-zinc-500">
      {label}
      <textarea
        value={value}
        onChange={(event) => update(key, event.target.value)}
        className={`${inputClass} mt-2 ${multiline ? "min-h-28" : ""} normal-case tracking-normal`}
        placeholder="One item per line"
      />
    </label>
  );
  return (
    <section>
      <div className="flex justify-between border-b border-zinc-200 pb-5">
        <h2 className="text-3xl font-display text-zinc-800">{project.title}</h2>
        <div className="flex gap-2">
          <label className="admin-muted-button flex cursor-pointer items-center gap-2 px-3 text-xs">
            <FiUpload /> Add media
            <input
              multiple
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(event) => {
                void upload(event.target.files);
                event.currentTarget.value = "";
              }}
            />
          </label>
          <button
            disabled={busy}
            onClick={save}
            className="admin-accent flex items-center gap-2 px-4 text-xs"
          >
            <FiSave /> Save
          </button>
          <button
            disabled={busy}
            title="Delete project"
            onClick={removeProject}
            className="admin-muted-button p-3 text-red-500"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {(
          [
            "title",
            "slug",
            "location",
            "category",
            "status",
            "price",
            "developer",
            "configurations",
            "image",
            "video",
          ] as const
        ).map((key) => (
          <label
            key={key}
            className="text-xs uppercase tracking-widest text-zinc-500"
          >
            {key}
            <input
              value={project[key] || ""}
              onChange={(event) => update(key, event.target.value)}
              className={`${inputClass} mt-2 normal-case tracking-normal`}
            />
          </label>
        ))}
      </div>
      <div className="mt-5 space-y-4">
        {field("description", "Description", project.description)}
        {field("overview", "Overview", project.overview)}
      </div>
      <div className="mt-8 border-t border-zinc-200 pt-6">
        <p className="text-xs uppercase tracking-widest text-zinc-500">
          Project detail content
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {field("highlights", "Highlights", listValue(project.highlights))}
          {field("facts", "Facts", listValue(project.facts))}
          {field("sizes", "Configurations and sizes", listValue(project.sizes))}
          {field(
            "considerations",
            "Things to consider",
            listValue(project.considerations),
          )}
          {field("similar", "Similar projects", listValue(project.similar))}
          {field("bestSuitedFor", "Best suited for", project.bestSuitedFor)}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {field("amenities", "Amenities JSON", jsonValue(project.amenities))}
          {field("faqs", "FAQs JSON", jsonValue(project.faqs))}
        </div>
      </div>
      <div className="mt-8 border-t border-zinc-200 pt-6">
        <p className="text-xs uppercase tracking-widest text-zinc-500">
          Search preview
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-xs uppercase tracking-widest text-zinc-500">
            SEO JSON
            <textarea
              value={jsonValue(project.seo)}
              onChange={(event) => update("seo", event.target.value)}
              className={`${inputClass} mt-2 min-h-36 font-mono text-xs normal-case tracking-normal`}
            />
          </label>
        </div>
      </div>
      <MediaLibrary
        project={project}
        removeMedia={removeMedia}
        update={update}
      />
      <button
        onClick={() => setAdvanced(!advanced)}
        className="mt-6 text-xs uppercase tracking-widest text-zinc-500"
      >
        {advanced ? "Hide" : "Show"} advanced JSON editor
      </button>
      {advanced && (
        <textarea
          value={json}
          onChange={(event) => setJson(event.target.value)}
          className="admin-input mt-3 min-h-[420px] w-full p-4 font-mono text-xs"
        />
      )}
      {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}
    </section>
  );
}
function MediaLibrary({
  project,
  update,
  removeMedia,
}: {
  project: ManagedProject;
  update: (key: keyof ManagedProject, value: string) => void;
  removeMedia: (src: string) => void;
}) {
  return (
    <div className="mt-7 rounded-2xl border border-dashed border-zinc-300 bg-white/40 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-700">Media library</p>
          <p className="mt-1 text-xs text-zinc-500">
            Select an image for the cover or delete an asset.
          </p>
        </div>
        <FiImage className="text-zinc-400" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(project.gallery || []).map((media) => (
          <div
            key={media.src}
            className={`group relative aspect-[4/3] overflow-hidden rounded-xl border-2 ${project.image === media.src ? "border-[#eeeae2]" : "border-transparent"}`}
          >
            {media.type === "video" ? (
              <video
                src={media.src}
                muted
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={media.src}
                alt={media.label}
                className="h-full w-full object-cover"
              />
            )}
            <button
              type="button"
              title="Use as cover"
              onClick={() => update("image", media.src)}
              className="absolute inset-x-1 bottom-1 bg-black/70 px-2 py-1 text-[10px] text-white"
            >
              {project.image === media.src ? "Cover image" : "Use as cover"}
            </button>
            <button
              type="button"
              title="Delete media"
              onClick={() => removeMedia(media.src)}
              className="absolute right-1 top-1 rounded bg-black/75 p-2 text-red-300"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
      {!(project.gallery || []).length && (
        <p className="mt-4 text-xs text-zinc-500">No media yet.</p>
      )}
    </div>
  );
}
function AboutEditor({
  about,
  setAbout,
  upload,
  save,
  message,
  busy,
}: {
  about: AboutContent;
  setAbout: (value: AboutContent) => void;
  upload: (file: File) => void;
  save: () => void;
  message: string;
  busy: boolean;
}) {
  const update = (
    key: keyof AboutContent,
    value: string | string[] | { title: string; desc: string }[],
  ) => setAbout({ ...about, [key]: value });
  const listValue = (value: string[]) =>
    Array.isArray(value) ? value.join("\n") : "";
  const valuesValue =
    typeof about.values === "string"
      ? about.values
      : JSON.stringify(about.values, null, 2);
  return (
    <section className="admin-panel mt-5 max-w-5xl p-5">
      <h2 className="text-3xl font-display text-zinc-800">About page</h2>
      <div className="mt-6 border-b border-zinc-200 pb-6">
        <p className="text-xs uppercase tracking-widest text-zinc-500">Hero</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label>
            Hero heading
            <input
              value={about.heroTitle}
              onChange={(e) => update("heroTitle", e.target.value)}
              className={`${inputClass} mt-2`}
            />
          </label>
          <label>
            Hero video URL
            <input
              value={about.heroVideo}
              onChange={(e) => update("heroVideo", e.target.value)}
              className={`${inputClass} mt-2`}
            />
          </label>
          <label>
            Hero image URL
            <input
              value={about.heroImage}
              onChange={(e) => update("heroImage", e.target.value)}
              className={`${inputClass} mt-2`}
            />
          </label>
        </div>
        <div className="mt-4 flex gap-3">
          <label className="admin-muted-button cursor-pointer p-3 text-xs">
            Upload image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) upload(file);
              }}
            />
          </label>
          <label className="admin-muted-button cursor-pointer p-3 text-xs">
            Upload video
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) upload(file);
              }}
            />
          </label>
        </div>
      </div>
      <div className="mt-6 border-b border-zinc-200 pb-6">
        <p className="text-xs uppercase tracking-widest text-zinc-500">
          Introduction
        </p>
        <label className="mt-4 block">
          Introduction heading
          <input
            value={about.introTitle}
            onChange={(e) => update("introTitle", e.target.value)}
            className={`${inputClass} mt-2`}
          />
        </label>
        <label className="mt-4 block">
          Introduction paragraphs
          <textarea
            value={listValue(about.introParagraphs)}
            onChange={(e) => update("introParagraphs", e.target.value)}
            className={`${inputClass} mt-2 min-h-40`}
            placeholder="One paragraph per line"
          />
        </label>
      </div>
      <div className="mt-6 border-b border-zinc-200 pb-6">
        <p className="text-xs uppercase tracking-widest text-zinc-500">
          Director profile
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label>
            Section label
            <input
              value={about.directorEyebrow}
              onChange={(e) => update("directorEyebrow", e.target.value)}
              className={`${inputClass} mt-2`}
            />
          </label>
          <label>
            Section heading
            <input
              value={about.directorTitle}
              onChange={(e) => update("directorTitle", e.target.value)}
              className={`${inputClass} mt-2`}
            />
          </label>
          <label>
            Director name
            <input
              value={about.directorName}
              onChange={(e) => update("directorName", e.target.value)}
              className={`${inputClass} mt-2`}
            />
          </label>
          <label>
            Director role
            <input
              value={about.directorRole}
              onChange={(e) => update("directorRole", e.target.value)}
              className={`${inputClass} mt-2`}
            />
          </label>
        </div>
        <label className="mt-4 block">
          Director paragraphs
          <textarea
            value={listValue(about.directorParagraphs)}
            onChange={(e) => update("directorParagraphs", e.target.value)}
            className={`${inputClass} mt-2 min-h-40`}
            placeholder="One paragraph per line"
          />
        </label>
      </div>
      <div className="mt-6 border-b border-zinc-200 pb-6">
        <p className="text-xs uppercase tracking-widest text-zinc-500">
          Quote and values
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label>
            Quote
            <textarea
              value={about.quote}
              onChange={(e) => update("quote", e.target.value)}
              className={`${inputClass} mt-2 min-h-24`}
            />
          </label>
          <label>
            Quote author
            <input
              value={about.quoteAuthor}
              onChange={(e) => update("quoteAuthor", e.target.value)}
              className={`${inputClass} mt-2`}
            />
          </label>
        </div>
        <label className="mt-4 block">
          Values JSON
          <textarea
            value={valuesValue}
            onChange={(e) => update("values", e.target.value)}
            className={`${inputClass} mt-2 min-h-40 font-mono text-xs`}
            placeholder='[{"title":"Precision","desc":"..."}]'
          />
        </label>
      </div>
      <div className="mt-5 flex justify-end">
        <button
          disabled={busy}
          onClick={save}
          className="admin-accent flex items-center gap-2 px-4 py-3 text-xs"
        >
          <FiSave /> Save About Page
        </button>
      </div>
      {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}
    </section>
  );
}

function ProjectEditorSimple({ projects, setProjects }: { projects: ManagedProject[]; setProjects: (projects: ManagedProject[]) => void }) {
  const [selectedProject, setSelectedProject] = useState<ManagedProject | null>(null);
  
  if (!selectedProject) {
    return (
      <div>
        <h2 className="text-2xl font-display text-text-primary mb-4">Select a Project to Edit</h2>
        <div className="space-y-2">
          {projects.map((project) => (
            <button
              key={project.slug}
              onClick={() => setSelectedProject(project)}
              className="w-full text-left admin-panel p-4 hover:bg-surface transition-colors"
            >
              <div className="font-medium text-text-primary">{project.title}</div>
              <div className="text-sm text-muted">{project.location}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setSelectedProject(null)}
        className="mb-4 text-sm text-muted hover:text-text-primary"
      >
        ← Back to Projects
      </button>
      <div className="admin-panel p-6">
        <h2 className="text-2xl font-display text-text-primary mb-4">{selectedProject.title}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">Title</label>
            <input
              value={selectedProject.title}
              onChange={(e) => {
                const updated = projects.map(p => p.slug === selectedProject.slug ? { ...p, title: e.target.value } : p);
                setProjects(updated);
                setSelectedProject({ ...selectedProject, title: e.target.value });
              }}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">Description</label>
            <textarea
              value={selectedProject.description}
              onChange={(e) => {
                const updated = projects.map(p => p.slug === selectedProject.slug ? { ...p, description: e.target.value } : p);
                setProjects(updated);
                setSelectedProject({ ...selectedProject, description: e.target.value });
              }}
              className={`${inputClass} min-h-24`}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">Price</label>
            <input
              value={selectedProject.price}
              onChange={(e) => {
                const updated = projects.map(p => p.slug === selectedProject.slug ? { ...p, price: e.target.value } : p);
                setProjects(updated);
                setSelectedProject({ ...selectedProject, price: e.target.value });
              }}
              className={inputClass}
            />
          </div>
        </div>
        <p className="mt-4 text-sm text-amber-600">Note: Changes are local only. Configure Supabase to save to database.</p>
      </div>
    </div>
  );
}

function HomeEditor() {
  const [home, setHome] = useState<HomeContent>(defaultHome);
  const [json, setJson] = useState(JSON.stringify(defaultHome, null, 2));
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    loadHome().then((content) => {
      setHome(content);
      setJson(JSON.stringify(content, null, 2));
    });
  }, []);
  const update = (key: keyof HomeContent, value: string) => {
    const next = { ...home, [key]: value };
    setHome(next);
    setJson(JSON.stringify(next, null, 2));
  };
  const uploadHero = async (file: File) => {
    setBusy(true);
    setMessage(`Uploading ${file.name}...`);
    try {
      update("heroVideo", await uploadProjectMedia(file));
      setMessage("Hero video uploaded. Save the homepage to publish it.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Hero upload failed.",
      );
    }
    setBusy(false);
  };
  const save = async () => {
    setBusy(true);
    try {
      const content = JSON.parse(json) as HomeContent;
      await saveHome(content);
      setHome(content);
      setJson(JSON.stringify(content, null, 2));
      setMessage("Landing page saved.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Landing page save failed.",
      );
    }
    setBusy(false);
  };
  return (
    <section className="admin-panel mt-5 max-w-5xl p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            Landing page
          </p>
          <h2 className="mt-2 text-3xl font-display text-zinc-800">
            Homepage content
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Edit every visible homepage heading, paragraph, card, image URL,
            testimonial, FAQ, and CTA. Lists and cards are stored in the JSON
            editor below.
          </p>
        </div>
        <button
          disabled={busy}
          onClick={save}
          className="admin-accent flex shrink-0 items-center gap-2 px-4 py-3 text-xs"
        >
          <FiSave /> Save Homepage
        </button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label>
          Hero heading
          <textarea
            value={home.heroTitle}
            onChange={(event) => update("heroTitle", event.target.value)}
            className={`${inputClass} mt-2 min-h-24`}
          />
        </label>
        <label>
          Hero video URL
          <input
            value={home.heroVideo}
            onChange={(event) => update("heroVideo", event.target.value)}
            className={`${inputClass} mt-2`}
          />
          <span className="admin-muted-button mt-2 inline-flex cursor-pointer p-3 text-xs">
            Upload hero video
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadHero(file);
              }}
            />
          </span>
        </label>
        <label>
          Hero description
          <textarea
            value={home.heroDescription}
            onChange={(event) => update("heroDescription", event.target.value)}
            className={`${inputClass} mt-2 min-h-28`}
          />
        </label>
        <label>
          Final CTA heading
          <textarea
            value={home.ctaTitle}
            onChange={(event) => update("ctaTitle", event.target.value)}
            className={`${inputClass} mt-2 min-h-24`}
          />
        </label>
      </div>
      <textarea
        value={json}
        onChange={(event) => setJson(event.target.value)}
        className="admin-input mt-6 min-h-[680px] w-full p-4 font-mono text-xs"
      />
      {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}
    </section>
  );
}
