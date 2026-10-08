function Chat() {

    return (
        <div className="page-container">

            <div className="page-header">
                <div>
                    <h1>Assistente IntelliFit</h1>

                    <p className="page-description">
                        Tire dúvidas, encontre receitas e
                        aproveite melhor os alimentos da sua casa.
                    </p>
                </div>
            </div>

            <div className="chat-card">

                <div className="chat-header">
                    <div>
                        <h2>
                            Assistente IntelliFit
                        </h2>

                        <p>
                            Como posso ajudar?
                        </p>
                    </div>
                </div>

                <div className="chat-messages">

                    <div className="chat-message assistant">
                        <p>
                            Olá! Posso ajudar você a encontrar
                            receitas, consultar seus alimentos
                            e evitar desperdícios.
                        </p>
                    </div>

                </div>

                <form className="chat-input-area">

                    <input
                        type="text"
                        placeholder="Digite sua mensagem..."
                    />

                    <button type="submit">
                        Enviar
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Chat;