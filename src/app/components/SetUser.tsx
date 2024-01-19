"use client"

import { useEffect } from "react";

export function SetUser() {
    useEffect(() => {
        async function fetchCookie() {
            await fetch(`/api/users`, {
                credentials: 'include',
                headers: {
                    'Access-Control-Allow-Credentials': "true",
                }
            })
        }  
        
        void fetchCookie();
    }, [])

    return <></>
}