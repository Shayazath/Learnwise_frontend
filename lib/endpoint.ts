export const ENDPOINTS = {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    CURRENT_USER: "/auth/me",
    DOCUMENTS: "/documents",
    DOCUMENT: (documentId: string) => `/documents/${documentId}`,
    CHAT: (documentId: string) => `/documents/${documentId}/chat`,
    QUIZ: (documentId: string) => `/documents/${documentId}/quiz`,
};