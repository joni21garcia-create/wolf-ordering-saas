export default function Page() {
  return (
    <pre>
      {JSON.stringify(
        {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          key: process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0,20),
        },
        null,
        2
      )}
    </pre>
  );
}

