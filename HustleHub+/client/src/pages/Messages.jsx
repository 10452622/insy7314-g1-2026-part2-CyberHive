
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import ClientNavbar from "../components/ClientNavbar";
import { getCurrentUser } from "../services/authSession";

import {
    getMyConversations,
    getConversationMessages,
    sendConversationMessage
} from "../services/api";

function Messages() {
    const user = getCurrentUser();
    const currentUserId = String(
        user?.id || user?._id || ""
    );

    const [conversations, setConversations] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [messages, setMessages] = useState([]);

    const [draft, setDraft] = useState("");
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [messageError, setMessageError] = useState("");

    const messagesEndRef = useRef(null);
    const selectedBookingRef = useRef(null);

    useEffect(() => {
        selectedBookingRef.current = selectedBookingId;
    }, [selectedBookingId]);

    useEffect(() => {
        let active = true;

        const loadConversations = async () => {
            try {
                const data = await getMyConversations();

                if (!active) return;

                const list = Array.isArray(data.conversations)
                    ? data.conversations
                    : [];

                setConversations(list);
                setError("");

                setSelectedBookingId((previous) => {
                    if (
                        previous &&
                        list.some(
                            (item) =>
                                String(item.bookingId) === String(previous)
                        )
                    ) {
                        return previous;
                    }

                    return list.length > 0
                        ? String(list[0].bookingId)
                        : null;
                });
            } catch (err) {
                if (active) {
                    setError(
                        err.message ||
                        "Unable to load your conversations."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadConversations();

        const interval = setInterval(loadConversations, 5000);

        return () => {
            active = false;
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (!selectedBookingId) {
            setMessages([]);
            return;
        }

        let active = true;

        const loadMessages = async () => {
            try {
                const data = await getConversationMessages(
                    selectedBookingId
                );

                if (active) {
                    setMessages(
                        Array.isArray(data.messages)
                            ? data.messages
                            : []
                    );
                    setMessageError("");
                }
            } catch (err) {
                if (active) {
                    setMessageError(
                        err.message ||
                        "Unable to load messages."
                    );
                }
            } finally {
                if (active) {
                    setMessagesLoading(false);
                }
            }
        };

        setMessages([]);
        setMessagesLoading(true);
        setMessageError("");

        loadMessages();

        const interval = setInterval(loadMessages, 5000);

        return () => {
            active = false;
            clearInterval(interval);
        };
    }, [selectedBookingId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    const selectedConversation = conversations.find(
        (item) =>
            String(item.bookingId) === String(selectedBookingId)
    );

    const handleSelectConversation = (bookingId) => {
        setSelectedBookingId(String(bookingId));
        setDraft("");
        setMessageError("");
    };

    const handleSendMessage = async (event) => {
        event.preventDefault();

        const text = draft.trim();

        if (
            !text ||
            text.length > 2000 ||
            !selectedBookingId ||
            sending
        ) {
            return;
        }

        setSending(true);
        setMessageError("");

        try {
            const data = await sendConversationMessage(
                selectedBookingId,
                text
            );

            if (data.message) {
                setMessages((previous) => {
                    const exists = previous.some(
                        (item) =>
                            String(item._id) ===
                            String(data.message._id)
                    );

                    return exists
                        ? previous
                        : [...previous, data.message];
                });
            }

            setDraft("");
        } catch (err) {
            setMessageError(
                err.message ||
                "Unable to send your message."
            );
        } finally {
            setSending(false);
        }
    };

    const formatTime = (value) => {
        if (!value) return "";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleString("en-ZA", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <>
            <ClientNavbar />

            <main className="client-messaging-page">
                <div className="client-messaging-heading">
                    <span className="page-eyebrow">
                        HUSTLEHUB+ MESSAGES
                    </span>

                    <h1>Messages</h1>

                    <p>
                        Communicate with freelancers about
                        your bookings.
                    </p>
                </div>

                {loading ? (
                    <div className="orders-state">
                        <div className="state-icon">⏳</div>
                        <h2>Loading conversations...</h2>
                    </div>
                ) : error ? (
                    <div className="orders-state error-state">
                        <div className="state-icon">!</div>
                        <h2>Unable to load conversations</h2>
                        <p>{error}</p>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="orders-state">
                        <div className="state-icon">💬</div>

                        <h2>No conversations yet</h2>

                        <p>
                            Book a service to start messaging
                            the freelancer working on your order.
                        </p>

                        <Link
                            to="/gigs"
                            className="primary-button"
                        >
                            Browse Gigs
                        </Link>
                    </div>
                ) : (
                    <div className="client-messaging-layout">

                        {/* Conversation list */}
                        <aside className="client-conversation-sidebar">
                            <div className="client-sidebar-heading">
                                <h2>Conversations</h2>

                                <span>
                                    {conversations.length}
                                </span>
                            </div>

                            <div className="client-conversation-list">
                                {conversations.map((conversation) => {
                                    const bookingId = String(
                                        conversation.bookingId
                                    );

                                    const selected =
                                        bookingId ===
                                        String(selectedBookingId);

                                    const freelancerName =
                                        conversation.freelancerName ||
                                        "Freelancer";

                                    const initial = freelancerName
                                        .charAt(0)
                                        .toUpperCase();

                                    return (
                                        <button
                                            key={bookingId}
                                            type="button"
                                            className={
                                                "client-conversation-item" +
                                                (selected ? " selected" : "")
                                            }
                                            onClick={() =>
                                                handleSelectConversation(
                                                    bookingId
                                                )
                                            }
                                        >
                                            <span className="client-chat-avatar">
                                                {initial}
                                            </span>

                                            <span className="client-conversation-details">
                                                <strong>
                                                    {freelancerName}
                                                </strong>

                                                <small>
                                                    {conversation.gigTitle}
                                                </small>

                                                <span className="client-last-message">
                                                    {conversation.lastMessage?.text ||
                                                        "Start a conversation"}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </aside>

                        <section className="client-chat-panel">
                            {selectedConversation ? (
                                <>
                                    <header className="client-chat-header">
                                        <div className="client-chat-avatar">
                                            {(
                                                selectedConversation.freelancerName ||
                                                "F"
                                            )
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div>
                                            <h2>
                                                {selectedConversation.freelancerName}
                                            </h2>

                                            <p>
                                                {selectedConversation.gigTitle}
                                            </p>
                                        </div>
                                    </header>

                                    <div className="client-chat-messages">
                                        {messagesLoading ? (
                                            <div className="client-chat-placeholder">
                                                Loading messages...
                                            </div>
                                        ) : messages.length === 0 ? (
                                            <div className="client-chat-placeholder">
                                                <span>💬</span>

                                                <h3>
                                                    Start your conversation
                                                </h3>

                                                <p>
                                                    Send a message to discuss
                                                    your booking with the
                                                    freelancer.
                                                </p>
                                            </div>
                                        ) : (
                                            messages.map((message) => {
                                                const isMine =
                                                    String(message.sender) ===
                                                    currentUserId;

                                                return (
                                                    <div
                                                        key={message._id}
                                                        className={
                                                            "client-chat-message " +
                                                            (isMine
                                                                ? "mine"
                                                                : "theirs")
                                                        }
                                                    >
                                                        <div className="client-message-bubble">
                                                            <p>
                                                                {message.text}
                                                            </p>

                                                            <small>
                                                                {formatTime(
                                                                    message.createdAt
                                                                )}
                                                            </small>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}

                                        <div ref={messagesEndRef} />
                                    </div>

                                    {messageError && (
                                        <p
                                            className="client-message-error"
                                            role="alert"
                                        >
                                            {messageError}
                                        </p>
                                    )}

                                    <form
                                        className="client-chat-compose"
                                        onSubmit={handleSendMessage}
                                    >
                                        <textarea
                                            value={draft}
                                            onChange={(event) =>
                                                setDraft(event.target.value)
                                            }
                                            placeholder="Type your message..."
                                            maxLength={2000}
                                            rows={2}
                                            disabled={sending}
                                            aria-label="Message"
                                        />

                                        <button
                                            type="submit"
                                            className="primary-button"
                                            disabled={
                                                sending ||
                                                !draft.trim()
                                            }
                                        >
                                            {sending
                                                ? "Sending..."
                                                : "Send"}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="client-chat-placeholder">
                                    Select a conversation to begin.
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </main>
        </>
    );
}

export default Messages;
