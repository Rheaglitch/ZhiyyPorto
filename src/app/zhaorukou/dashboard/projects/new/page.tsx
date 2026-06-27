import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-100">Tambah Project</h1>
        <p className="text-sm text-dark-500 mt-1 font-mono">
          {`// isi detail project baru`}
        </p>
      </div>
      <ProjectForm />
    </div>
  );
}
