import API_URL from "./api";

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    created_at?: string;
}

export interface ChatResponse {
    reply: string;
    changed: boolean;
    actions: string[];
    pending: boolean;
    recognition?: {
        intent?: string;
        source?: string;
        confidence?: number;
    };
}

function authHeaders() {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };
}

export async function getChatHistory(): Promise<ChatMessage[]> {
    const response = await fetch(
        `${API_URL}/api/chat/history`,
        {
            method: "GET",
            headers: authHeaders()
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.error || "Erro ao carregar a conversa."
        );
    }

    return result;
}

export async function sendChatMessage(
    message: string
): Promise<ChatResponse> {
    const response = await fetch(
        `${API_URL}/api/chat`,
        {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({ message })
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.error || "Erro ao enviar mensagem."
        );
    }

    return result;
}

export async function clearChatHistory(): Promise<void> {
    const response = await fetch(
        `${API_URL}/api/chat/history`,
        {
            method: "DELETE",
            headers: authHeaders()
        }
    );

    if (!response.ok) {
        const result = await response.json().catch(() => ({}));

        throw new Error(
            result.error || "Erro ao apagar a conversa."
        );
    }
}
