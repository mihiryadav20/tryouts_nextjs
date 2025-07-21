import { getCurrentUser } from "./utils/auth";
import LoginButton from "./components/auth/LoginButton";
import UserProfile from "./components/auth/UserProfile";

export default async function Home() {
  const user = await getCurrentUser();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      {user ? (
        <>
          <UserProfile />
          <LoginButton />
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
}
