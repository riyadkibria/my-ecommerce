import { login } from "@/app/actions/auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        action={login}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border p-6 shadow"
      >
        <h1 className="text-2xl font-bold">Login</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="rounded border p-2"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="rounded border p-2"
        />

        <button
          type="submit"
          className="rounded bg-black p-2 text-white"
        >
          Login
        </button>
      </form>
    </main>
  );
}