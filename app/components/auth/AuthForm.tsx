'use client'

import { FormEvent, useEffect, useState } from "react"
import InputBox from "../inputBox/InputBox"
import { useRouter } from "next/navigation"
import { useUser } from "../hooks/userContext/UserProvider"

const base_url = process.env.NEXT_PUBLIC_BASE_URL
console.log(base_url)

const AuthForm = () => {
  const [state, setState] = useState<'SignIn' | 'SignUp'>('SignIn')
  const router = useRouter()
  const {setUser} = useUser()

  useEffect(() => {
    const token = window.localStorage.getItem("chat-user");
    if (token) {
      router.replace("/"); // already logged in → go home
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const payload = Object.fromEntries(formData.entries())

    if (state === "SignUp") {
      // --- SIGN UP API CALL ---
      try {
        const res = await fetch(`${base_url}/api/user/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })

        const data = await res.json()

        if (!res.ok) {
          alert(data.message || "Signup failed")
          return
        }

        setState('SignIn')
      } catch (error) {
        console.log(error)
        alert("Signup error")
      }

    } else {
      // --- SIGN IN API CALL ---
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })

        const data = await res.json()
        

        if (!res.ok) {
          alert(data.message || "Login failed")
          return
        }

        // Save token
        setUser(data)
        localStorage.setItem("chat-user", JSON.stringify(data))
        router.replace("/")
      } catch (error) {
        console.log(error)
        alert("Login error")
      }
    }
  }

  return (
    <div className="flex flex-col max-w-[400px] shadow border border-gray-200 p-4 rounded-xl">
      <h3 className="text-center text-purple-600 text-2xl my-4">{state}</h3>

      <form onSubmit={handleSubmit}>

        {state === 'SignUp' && (
          <InputBox
            label="username"
            required={true}
            type="text"
            placeholder="username"
            name="username"
          />
        )}

        <InputBox
          label="email"
          required={true}
          type="email"
          placeholder="ex...@gmail.com"
          name="email"
        />

        <InputBox
          label="password"
          required={true}
          minlen={6}
          type="password"
          placeholder="******"
          name="password"
        />

        <button
          className="w-full p-2 bg-black/90 text-white rounded my-2"
          type="submit"
        >
          {state}
        </button>

        <p className="text-black/60 text-sm">
          {state === 'SignIn'
            ? `don't have an account `
            : `have existing account `}
          <button
            type="button"
            onClick={() => setState(state === 'SignIn' ? 'SignUp' : 'SignIn')}
            className="underline text-purple-600 cursor-pointer"
          >
            {state === 'SignIn' ? 'create new' : 'sign in'}
          </button>
        </p>

      </form>
    </div>
  )
}

export default AuthForm
