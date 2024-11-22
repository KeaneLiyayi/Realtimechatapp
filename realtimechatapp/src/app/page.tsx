import { getServerSession } from "next-auth";

import { authConfig } from "@/lib/auth";
import { GoogleSignInButton } from "@/components/buttons";

export default async function Home() {
  const session = await getServerSession(authConfig);
  console.log(session?.user?.name);








  return (
    <div className="container mx-auto">
      {session ? (
        <div>Welcome, {session?.user?.name}!</div>
      ) : (
        <GoogleSignInButton />
      )}
    </div>
  );
}
