export declare const validateEmail: (email: string) => boolean;
export declare const validatePassword: (password: string) => {
    isValid: boolean;
    strength: "weak" | "medium" | "strong";
    errors: string[];
};
//# sourceMappingURL=validation.d.ts.map