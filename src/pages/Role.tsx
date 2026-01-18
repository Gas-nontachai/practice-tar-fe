import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllRole,
  createRole,
  updateRole,
  deleteRole,
} from "@/services/roleService";
import type { RoleRespond } from "@/types";
import { Button } from "@/components/ui/button";
import { DialogAlert } from "@/components/ui/dialog-alert";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/pagination";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

type Mode = "list" | "create" | "edit";

function Role() {
  const [roles, setRoles] = useState<RoleRespond[]>([]);
  const [selectedRole, setSelectedRole] = useState<RoleRespond | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoleRespond | null>(null);
  const [mode, setMode] = useState<Mode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllRole();
      setRoles(data);
      setCurrentPage(1);
    } catch {
      setError("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setAlertMessage("Role name is required");
      setAlertOpen(true);
      return;
    }
    await createRole({
      name,
      description,
    });
    setName("");
    setMode("list");
    loadRoles();
  };

  const handleUpdate = async () => {
    if (!selectedRole) return;
    await updateRole(selectedRole.id, {
      name,
      description,
    });
    setMode("list");
    setSelectedRole(null);
    loadRoles();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteRole(deleteTarget.id);
    setDeleteTarget(null);
    loadRoles();
  };

  const resetState = () => {
    setSelectedRole(null);
    setName("");
    setDescription("");
    setMode("list");
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pagedRoles = filteredRoles.slice(startIndex, startIndex + pageSize);
  const startCount = filteredRoles.length === 0 ? 0 : startIndex + 1;
  const endCount = Math.min(startIndex + pageSize, filteredRoles.length);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  if (loading) {
    return <h1 className="text-xl font-semibold">Loading...</h1>;
  }

  if (error) {
    return <h1 className="text-xl font-semibold text-red-500">{error}</h1>;
  }

  return (
    <section className="space-y-6">
      {mode === "list" && (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Role Management</h1>
            <Button onClick={() => setMode("create")}>
              <Plus className="mr-1 h-4 w-4" />
              Create Role
            </Button>
          </div>
          <div className="flex justify-start">
            <Input
              containerClassName="max-w-sm"
              placeholder="Search roles"
              suffix={<Search className="h-4 w-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            {pagedRoles.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No roles found.
              </div>
            ) : (
              pagedRoles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <Link className="flex-1" to={`/roles/${role.id}`}>
                    <p>ID: {role.id}</p>
                    <p>Name: {role.name}</p>
                    <p>Description: {role.description}</p>
                  </Link>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedRole(role);
                        setName(role.name);
                        setDescription(role.description || "");
                        setMode("edit");
                      }}
                    >
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setDeleteTarget(role)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalCount={filteredRoles.length}
            startCount={startCount}
            endCount={endCount}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {(mode === "create" || mode === "edit") && (
        <div className="space-y-4 rounded-lg border p-4">
          <h2 className="text-xl font-semibold">
            {mode === "create" ? "Create Role" : "Edit Role"}
          </h2>

          <Input
            placeholder="Role name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-2">
            <Button onClick={mode === "create" ? handleCreate : handleUpdate}>
              {mode === "create" ? (
                <Plus className="mr-1 h-4 w-4" />
              ) : (
                <Pencil className="mr-1 h-4 w-4" />
              )}
              {mode === "create" ? "Create" : "Update"}
            </Button>
            <Button variant="outline" onClick={resetState}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <DialogAlert
        open={deleteTarget !== null}
        title="Delete role?"
        description={
          deleteTarget
            ? `This will permanently delete ${deleteTarget.name}.`
            : undefined
        }
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
      <DialogAlert
        open={alertOpen}
        title="Validation error"
        description={alertMessage}
        mode="alert"
        onCancel={() => setAlertOpen(false)}
        onConfirm={() => setAlertOpen(false)}
      />
    </section>
  );
}

export default Role;
