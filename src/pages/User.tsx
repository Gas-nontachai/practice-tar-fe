import { useEffect, useState } from "react";
import {
  fetchAllUser,
  fetchUserByID,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/userService";
import type { UserRespond } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "list" | "create" | "edit" | "view";

function User() {
  const [users, setUsers] = useState<UserRespond[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserRespond | null>(null);
  const [mode, setMode] = useState<Mode>("list");

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllUser();
      setUsers(data);
    } catch {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const loadUserById = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserByID(id);
      setSelectedUser(data);
      setName(data.name);
      setMode("view");
    } catch {
      setError("Failed to fetch user");
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

  const handleDelete = async (id: number) => {
    await deleteUser(id);
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

  if (loading) {
    return <h1 className="text-xl font-semibold">Loading...</h1>;
  }

  if (error) {
    return <h1 className="text-xl font-semibold text-red-500">{error}</h1>;
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">User Management</h1>

      {mode === "list" && (
        <>
          <Button onClick={() => setMode("create")}>Create User</Button>

          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => loadUserById(user.id)}
                >
                  <p>ID: {user.id}</p>
                  <p>Name: {user.name}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedUser(user);
                      setName(user.name);
                      setMode("edit");
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
              {mode === "create" ? "Create" : "Update"}
            </Button>
            <Button variant="outline" onClick={resetState}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {mode === "view" && selectedUser && (
        <div className="space-y-4 rounded-lg border bg-gray-50 p-4">
          <h2 className="text-xl font-semibold">User Detail</h2>
          <p>ID: {selectedUser.id}</p>
          <p>Name: {selectedUser.name}</p>

          <Button onClick={resetState}>Back</Button>
        </div>
      )}
    </section>
  );
}

export default User;
