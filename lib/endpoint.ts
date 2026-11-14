export const ENDPOINTS = {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    CURRENT_USER: "/api/auth/me",
    DOCUMENTS: "/api/documents",
    DOCUMENT: (documentId: string) => `/api/documents/${documentId}`,
    CHAT: (documentId: string) => `/api/documents/${documentId}/chat`,
    QUIZ: (documentId: string) => `/api/documents/${documentId}/quiz`,
};