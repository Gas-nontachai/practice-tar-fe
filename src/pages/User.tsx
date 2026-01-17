import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllUser,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/userService";
import type { UserRespond } from "@/types";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/pagination";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

type Mode = "list" | "create" | "edit";

function User() {
  const [users, setUsers] = useState<UserRespond[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserRespond | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRespond | null>(null);
  const [mode, setMode] = useState<Mode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllUser();
      setUsers(data);
      setCurrentPage(1);
    } catch {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createUser({ name });
    setName("");
    setMode("list");
    loadUsers();
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    await updateUser(selectedUser.id, { name });
    setMode("list");
    setSelectedUser(null);
    loadUsers();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteUser(deleteTarget.id);
    setDeleteTarget(null);
    loadUsers();
  };

  const resetState = () => {
    setSelectedUser(null);
    setName("");
    setMode("list");
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pagedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);
  const startCount = filteredUsers.length === 0 ? 0 : startIndex + 1;
  const endCount = Math.min(startIndex + pageSize, filteredUsers.length);

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
            <h1 className="text-2xl font-semibold">User Management</h1>
            <Button onClick={() => setMode("create")}>
              <Plus className="mr-1 h-4 w-4" />
              Create User
            </Button>
          </div>

          <div className="flex justify-start">
            <Input
              containerClassName="max-w-sm"
              placeholder="Search users"
              suffix={<Search className="h-4 w-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            {pagedUsers.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No users found.
              </div>
            ) : (
              pagedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <Link className="flex-1" to={`/users/${user.id}`}>
                    <p>ID: {user.id}</p>
                    <p>Name: {user.name}</p>
                  </Link>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedUser(user);
                        setName(user.name);
                        setMode("edit");
                      }}
                    >
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setDeleteTarget(user)}
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
            totalCount={filteredUsers.length}
            startCount={startCount}
            endCount={endCount}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {(mode === "create" || mode === "edit") && (
        <div className="space-y-4 rounded-lg border p-4">
          <h2 className="text-xl font-semibold">
            {mode === "create" ? "Create User" : "Edit User"}
          </h2>

          <Input
            placeholder="User name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete user?"
        description={
          deleteTarget
            ? `This will permanently delete ${deleteTarget.name}.`
            : undefined
        }
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

export default User;
