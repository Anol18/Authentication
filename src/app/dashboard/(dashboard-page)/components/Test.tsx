"use client"


import { clientFetch } from "@/lib/clientFetch"
import { useEffect } from "react"

// import { getAuthTokensAsObject, getNextAuthCookies } from "@/lib/apiTest";


const Test = () => {

useEffect(()=>{
    async function data() {
        const res = await clientFetch("/auth/signin")
        const data = await res.json()
        console.log(data);
    }
    data()
},[])

  return (
    <div>
      
    </div>
  )
}

export default Test
