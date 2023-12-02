import { StateSetter } from "../types";
import { SERVER_URL } from "./constants";

export const login = async (username: string, password: string, setErrors: StateSetter<string[]>) => {
    try {
        const res = await fetch(`${SERVER_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
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
        setErrors(['Unable to connect to server sucessfully.'])
        return null
    }
}

export const storeToken = (token: string) => {
    localStorage.setItem('jwt', token);
}

export const getStoredToken = () => {
    return localStorage.getItem('jwt');

} 

export const authHeader = () => {
	const token = getStoredToken();
	return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const logout = () => {
	localStorage.removeItem('jwt');

};

export const isLoggedIn = () => {
	return !!localStorage.getItem('jwt');
};
