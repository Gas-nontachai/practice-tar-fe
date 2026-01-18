import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchRoleByID } from "@/services/roleService";
import type { RoleRespond } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

function RoleDetail() {
  const { id } = useParams();
  const [role, setRole] = useState<RoleRespond | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid role id");
      setRole(null);
      return;
    }

    let isMounted = true;

    const loadRole = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRoleByID(id);
        if (isMounted) {
          setRole(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to fetch role");
          setRole(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRole();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <h1 className="text-xl font-semibold">Loading...</h1>;
  }

  if (error) {
    return <h1 className="text-xl font-semibold text-red-500">{error}</h1>;
  }

  if (!role) {
    return <h1 className="text-xl font-semibold">Role not found</h1>;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Role Detail</h1>
        <Button asChild>
          <Link to="/roles" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Roles
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{role.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>ID: {role.id}</p>
          <p>Name: {role.name}</p>
          <p>Description: {role.description}</p>
        </CardContent>
      </Card>
    </section>
  );
}

export default RoleDetail;
