import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchUserByID } from "@/services/userService";
import type { UserRespond } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState<UserRespond | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid user id");
      setUser(null);
      return;
    }

    let isMounted = true;

    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUserByID(id);
        if (isMounted) {
          setUser(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to fetch user");
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

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

  if (!user) {
    return <h1 className="text-xl font-semibold">User not found</h1>;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">User Detail</h1>{" "}
        <Button asChild>
          <Link to="/users" className="flex items-center">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Users
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>ID: {user.id}</p>
          <p>Name: {user.name}</p>
        </CardContent>
      </Card>
    </section>
  );
}

export default UserDetail;
