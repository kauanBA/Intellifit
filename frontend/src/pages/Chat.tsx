import {
    type FormEvent,
    useEffect,
    useRef,
    useState
} from "react";

import {
    clearChatHistory,
    getChatHistory,
    sendChatMessage,
    type ChatMessage
} from "../services/chatService";

const defaultActions = [
    "O que tenho na geladeira?",
    "O que vence neste mês?",
    "Cadastrar alimento",
    "Registrar consumo",
    "Sugerir receitas",
    "Resumo do estoque"
];

function RichText({ text }: { text: string }) {
    return (
        <>
            {text.split(/(\*\*[^*]+\*\*)/g).map(
                (part, index) =>
                    part.startsWith("**") &&
                    part.endsWith("**") ? (
                        <strong key={index}>
                            {part.slice(2, -2)}
                        </strong>
                    ) : (
                        part
                    )
            )}
        </>
    );
}

function AssistantMessage({ content }: { content: string }) {
    return (
        <div className="chat-message-content">
            {content.split("\n\n").map((block, index) => (
                <p key={index}>
                    <RichText text={block} />
                </p>
            ))}
        </div>
    );
}

function Chat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [actions, setActions] = useState(defaultActions);
    const [draft, setDraft] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function loadHistory() {
            try {
                setError("");
                const history = await getChatHistory();
                setMessages(history);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Erro ao carregar a conversa."
                );
            } finally {
                setLoading(false);
            }
        }

        void loadHistory();
    }, []);

    useEffect(() => {
        endRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages, sending]);

    async function send(message: string) {
        const text = message.trim();

        if (!text || sending) {
            return;
        }

        setSending(true);
        setDraft("");
        setError("");
        setNotice("");

        setMessages((current) => [
            ...current,
            {
                role: "user",
                content: text
            }
        ]);

        try {
            const result = await sendChatMessage(text);

            setMessages((current) => [
                ...current,
                {
                    role: "assistant",
                    content: result.reply
                }
            ]);

            setActions(
                result.actions.length > 0
                    ? result.actions
                    : result.pending
                        ? ["Cancelar"]
                        : defaultActions
            );

            if (result.changed) {
                setNotice(
                    "Estoque atualizado pelo assistente."
                );
            }
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Erro ao enviar mensagem."
            );
        } finally {
            setSending(false);
        }
    }

    function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        void send(draft);
    }

    async function handleClear() {
        const confirmed = window.confirm(
            "Apagar apenas a conversa? Os alimentos e alterações já confirmadas serão mantidos."
        );

        if (!confirmed) {
            return;
        }

        setClearing(true);
        setError("");
        setNotice("");

        try {
            await clearChatHistory();
            setMessages([]);
            setActions(defaultActions);
            setDraft("");
            setNotice(
                "Conversa apagada. Seus alimentos foram mantidos."
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Erro ao apagar a conversa."
            );
        } finally {
            setClearing(false);
        }
    }

    return (
        <div className="page-container">

            <div className="page-header">
                <div>
                    <h1>Assistente IntelliFit</h1>

                    <p className="page-description">
                        Consulte seu estoque, registre compras e consumo,
                        acompanhe validades e encontre ideias de receitas.
                    </p>
                </div>
            </div>

            <div className="chat-card">

                <div className="chat-header">
                    <div>
                        <h2>Assistente IntelliFit</h2>
                        <p>Como posso ajudar?</p>
                    </div>

                    <button
                        type="button"
                        className="chat-clear-button"
                        onClick={() => void handleClear()}
                        disabled={sending || clearing}
                    >
                        {clearing ? "Apagando..." : "Limpar conversa"}
                    </button>
                </div>

                <div
                    className="chat-messages"
                    aria-live="polite"
                >
                    <div className="chat-message assistant">
                        <p>
                            Olá! Posso organizar seus alimentos,
                            consultar validades, registrar compras e
                            consumo e sugerir receitas. O que vamos
                            fazer hoje?
                        </p>
                    </div>

                    {loading && (
                        <div className="chat-message assistant">
                            <p>Carregando conversa...</p>
                        </div>
                    )}

                    {messages.map((message, index) => (
                        <div
                            key={`${message.role}-${index}`}
                            className={`chat-message ${message.role}`}
                        >
                            {message.role === "assistant" ? (
                                <AssistantMessage
                                    content={message.content}
                                />
                            ) : (
                                <p>{message.content}</p>
                            )}
                        </div>
                    ))}

                    {sending && (
                        <div className="chat-message assistant chat-typing">
                            <p>Consultando sua cozinha...</p>
                        </div>
                    )}

                    <div ref={endRef} />
                </div>

                <div className="chat-actions">
                    {actions.map((action) => (
                        <button
                            key={action}
                            type="button"
                            onClick={() => void send(action)}
                            disabled={sending}
                        >
                            {action}
                        </button>
                    ))}
                </div>

                {notice && (
                    <p className="chat-notice">
                        {notice}
                    </p>
                )}

                {error && (
                    <p className="form-error chat-error">
                        {error}
                    </p>
                )}

                <form
                    className="chat-input-area"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        maxLength={2000}
                        value={draft}
                        onChange={(event) =>
                            setDraft(event.target.value)
                        }
                        placeholder="Ex.: usei 2 ovos"
                        disabled={sending}
                    />

                    <button
                        type="submit"
                        disabled={
                            sending || !draft.trim()
                        }
                    >
                        {sending ? "Enviando..." : "Enviar"}
                    </button>
                </form>

            </div>

        </div>
    );
}

export default Chat;
