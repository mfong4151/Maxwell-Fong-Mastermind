import React from "react";
import { StateSetter } from "../types";
import { SERVER_URL } from "./constants";
import { useGame } from "../context/GameContext";

export const login = async (username: string, password: string, setErrors: StateSetter<string[]>) => {
    try {
        const res = await fetch(`${SERVER_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (res.ok) {
            return data.token;

        } else {
            setErrors(data.errors)
            return null
        }

    } catch (error: any) {
        setErrors(["Unable to connect to server sucessfully."])
        return null
    }
}

export const storeToken = (token: string) => {
    localStorage.setItem("jwt", token);
}

export const getStoredToken = () => {
    return localStorage.getItem("jwt");

} 

export const authHeader = () => {
	const token = getStoredToken();
	return token ? { "Authorization": `Bearer ${token}` } : {};
};

export const logout = () => {
	localStorage.removeItem("jwt");

};

export const isLoggedIn = () => {
	return !!localStorage.getItem("jwt");
};


export const jwtFetch = (url: string, body: any = {}, method: string = "GET", ): Promise<Response> => {

    const headers = {
        ...authHeader(),        
        "Content-Type": "application/json",
    } as HeadersInit

    const req: {method: string, headers: HeadersInit, body? : any} = {
        headers, 
        method,
    }

    if (method !== "GET"){
        req.body = JSON.stringify(body);
    }
    
    return fetch(url, req)
    
}