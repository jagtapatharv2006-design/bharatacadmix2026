"use client";
import { useAuth } from "@/lib/context/AuthContext";

export default function LoginButton() {
  const {
    User,
    isloading,
    handleSignInWithGoogle,
    handleLogout,
  } = useAuth();

  if (isloading) {
    return <h1>loading...</h1>
  }

  if (User) {
    return <div>
      <button onClick={() => handleLogout()} type="button" className="text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5">
        logout
      </button>
    </div>
  }
  return <section>
    <button
      onClick={() => {
        handleSignInWithGoogle();

      }}
      type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5">login</button>
  </section>
}