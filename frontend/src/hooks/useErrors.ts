import { useEffect, useState } from "react"

export const useErrors = () =>{
    const [errors , setErrors] = useState<string[]>([])
    const useClearErrorsEffect = (...dependencies: any) => useEffect(()=>{
        setErrors([])
    }, dependencies)
    
    return {errors, setErrors, useClearErrorsEffect}
}