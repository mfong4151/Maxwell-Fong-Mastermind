export interface ErrorsOptions{
    errors: string[];
    setErrors: React.Dispatch<React.SetStateAction<string[]>>;
    useClearErrorsEffect: (...dependencies: any) => void
}