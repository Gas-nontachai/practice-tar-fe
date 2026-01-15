import { useEffect, useState } from "react";
import { fetchExample } from "../services/exampleService";

function Home() {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndex = async () => {
      try {
        const res = await fetchExample();
        setMessage(res.message);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIndex();
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">API Status</h1>
      <div className="rounded-lg border p-4">
        {loading ? "Loading..." : error ? error : message}
      </div>
    </section>
  );
}

export default Home;
