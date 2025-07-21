import { getCurrentUser } from "./utils/auth";
import LoginButton from "./components/auth/LoginButton";

export default async function Home() {
  const user = await getCurrentUser();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginButton />
    </div>
  );
}
