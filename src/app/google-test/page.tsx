"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function GoogleAuthTest() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      console.log("Starting Google sign in...");
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/dashboard",
      });
      console.log("Sign in result:", result);

      if (result?.ok && !result?.error) {
        console.log("Sign in successful, redirecting to dashboard...");
        router.push("/dashboard");
      } else {
        console.error("Sign in failed:", result?.error);
      }
    } catch (error) {
      console.error("Error during Google sign in:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Google Auth Test
        </h1>

        {session ? (
          <div className="text-center">
            <div className="mb-4">
              <img
                src={session.user?.image || "/default-avatar.png"}
                alt="Profile"
                className="w-16 h-16 rounded-full mx-auto mb-2"
              />
              <h2 className="text-xl font-semibold">{session.user?.name}</h2>
              <p className="text-gray-600">{session.user?.email}</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Go to Dashboard
              </button>
              <button
                onClick={handleSignOut}
                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">Not signed in</p>
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <pre className="text-xs overflow-auto whitespace-pre-wrap">
            Status: {status}
            {session &&
              `
Session: ${JSON.stringify(session, null, 2)}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
