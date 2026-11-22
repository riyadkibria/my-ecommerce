import {signUp} from "@/app/actions/auth";

export default function SignupPage() {
  return (
    <main>
      <h1>Sign Up</h1>

      <form action={signUp}>
        <input
          type="email"
          name="email"
          placeholder="Email"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
        />

        <button type="submit">
          Create Account
        </button>
      </form>
    </main>
  );
}