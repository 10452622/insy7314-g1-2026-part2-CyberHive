import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Paperclip,
  Send,
  Smile,
  CheckCheck,
} from "lucide-react";

import FreelancerHeader from "../components/FreelancerHeader";
import {
  getMyConversations,
  getConversationMessages,
  sendConversationMessage,
} from "../services/api";

import "../styles/FreelancerMessages.css";

const getInitials = (name = "Client") =>
  String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "C";

const formatTime = (dateValue) => {
  if (!dateValue) return "";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
  });
};

const formatMessageTime = (dateValue) => {
  if (!dateValue) return "";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDisplayName = (conversation) => {
  if (conversation.clientName) return conversation.clientName;
  if (conversation.otherParticipantName) {
    return conversation.otherParticipantName;
  }
  if (conversation.client?.name) return conversation.client.name;

  if (conversation.clientId) {
    return `Client ${String(conversation.clientId).slice(-4)}`;
  }

  return "Client";
};

const normaliseConversation = (conversation) => {
  const bookingId = String(
    conversation.bookingId || conversation._id || conversation.id || ""
  );

  const lastMessage = conversation.lastMessage || {};
  const name = getDisplayName(conversation);

  return {
    ...conversation,
    id: bookingId,
    bookingId,
    name,
    initials: getInitials(name),
    gigTitle: conversation.gigTitle || "Service",
    freelancerId: String(conversation.freelancerId || ""),
    clientId: String(conversation.clientId || ""),
    messages: [],
    time: formatTime(lastMessage.createdAt || conversation.createdAt),
    preview: lastMessage.text || "No messages yet.",
  };
};

function FreelancerMessages() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [search, setSearch] = useState("");
  const [messageText, setMessageText] = useState("");
  const [notice, setNotice] = useState("");

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeId
  );

  useEffect(() => {
    let cancelled = false;

    const loadConversations = async () => {
      setLoadingConversations(true);

      try {
        const response = await getMyConversations();

        if (cancelled) return;

        const data = Array.isArray(response.conversations)
          ? response.conversations
          : [];

        const loaded = data
          .map(normaliseConversation)
          .filter((conversation) => conversation.bookingId);

        setConversations(loaded);
        setActiveId((currentId) =>
          loaded.some((conversation) => conversation.id === currentId)
            ? currentId
            : loaded[0]?.id || ""
        );
      } catch (error) {
        if (!cancelled) {
          setNotice(error.message || "Unable to load conversations.");
        }
      } finally {
        if (!cancelled) setLoadingConversations(false);
      }
    };

    loadConversations();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!activeId) return;

    let cancelled = false;

    const loadMessages = async () => {
      setLoadingMessages(true);

      try {
        const response = await getConversationMessages(activeId);

        if (cancelled) return;

        const messages = Array.isArray(response.messages)
          ? response.messages
          : [];

        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === activeId
              ? {
                  ...conversation,
                  messages,
                  preview: messages.length
                    ? messages[messages.length - 1].text
                    : "No messages yet.",
                  time: messages.length
                    ? formatTime(messages[messages.length - 1].createdAt)
                    : conversation.time,
                }
              : conversation
          )
        );
      } catch (error) {
        if (!cancelled) {
          setNotice(error.message || "Unable to load messages.");
        }
      } finally {
        if (!cancelled) setLoadingMessages(false);
      }
    };

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [activeId]);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return conversations;

    return conversations.filter((conversation) =>
      [
        conversation.name,
        conversation.gigTitle,
        conversation.preview,
        ...conversation.messages.map((message) => message.text || ""),
      ].some((value) => String(value).toLowerCase().includes(query))
    );
  }, [conversations, search]);

  const selectConversation = (id) => {
    if (id === activeId) return;

    setActiveId(id);
    setMessageText("");
    setNotice("");
  };

  const sendMessage = async (event) => {
    event.preventDefault();

    const text = messageText.trim();

    if (!text || !activeConversation || sending) return;

    setSending(true);
    setNotice("");

    try {
      const response = await sendConversationMessage(
        activeConversation.bookingId,
        text
      );

      if (!response.message) {
        throw new Error("The server did not return the saved message.");
      }

      const savedMessage = response.message;

      setConversations((current) =>
        current.map((conversation) => {
          if (conversation.id !== activeId) return conversation;

          return {
            ...conversation,
            messages: [...conversation.messages, savedMessage],
            preview: savedMessage.text,
            time: formatTime(savedMessage.createdAt),
          };
        })
      );

      setMessageText("");
    } catch (error) {
      setNotice(error.message || "Unable to send your message.");
    } finally {
      setSending(false);
    }
  };

  const getMessageSender = (message) => {
    if (typeof message.isMine === "boolean") {
      return message.isMine ? "me" : "them";
    }

    return String(message.sender) === activeConversation?.freelancerId
      ? "me"
      : "them";
  };

  const startConversation = () => {
    setNotice(
      "Conversations are linked to bookings. Select an existing booking conversation."
    );
  };

  return (
    <main className="freelancer-dashboard fm-page">
      <FreelancerHeader />

      <div className="freelancer-dashboard-content fm-content">
        <section className="fm-heading">
          <div>
            <h1>Messages</h1>
            <p>Communicate with clients and manage your conversations.</p>
          </div>

          <button
            type="button"
            className="fm-new-message"
            onClick={startConversation}
          >
            <Plus size={15} />
            New Message
          </button>
        </section>

        {notice && (
          <div className="fm-notice" role="status">
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        <section className="fm-messenger">
          <aside className="fm-conversations">
            <div className="fm-conversations-heading">
              <div>
                <h2>All Messages</h2>
                <span>{conversations.length} conversations</span>
              </div>

              <button
                type="button"
                className="fm-icon-button"
                onClick={startConversation}
                aria-label="Start a new conversation"
              >
                <Plus size={17} />
              </button>
            </div>

            <label className="fm-search">
              <Search size={15} />
              <input
                type="search"
                placeholder="Search messages..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search conversations"
              />
            </label>

            <div className="fm-conversation-list">
              {loadingConversations ? (
                <div className="fm-list-empty">
                  <span>Loading conversations...</span>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="fm-list-empty">
                  <Search size={20} />
                  <span>
                    {search.trim()
                      ? "No conversations found."
                      : "You don't have any booking conversations yet."}
                  </span>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    className={`fm-conversation ${
                      activeId === conversation.id ? "is-active" : ""
                    }`}
                    onClick={() => selectConversation(conversation.id)}
                  >
                    <span className="fm-avatar">
                      {conversation.initials}
                    </span>

                    <span className="fm-conversation-info">
                      <span className="fm-conversation-top">
                        <strong>{conversation.name}</strong>
                        <small>{conversation.time}</small>
                      </span>

                      <span className="fm-conversation-bottom">
                        <span>{conversation.preview}</span>
                      </span>
                    </span>
                  </button>
                ))
              )}
            </div>
          </aside>

          <section className="fm-chat">
            {activeConversation ? (
              <>
                <header className="fm-chat-header">
                  <span className="fm-avatar">
                    {activeConversation.initials}
                  </span>

                  <div className="fm-chat-contact">
                    <strong>{activeConversation.name}</strong>
                    <span>{activeConversation.gigTitle}</span>
                  </div>

                  <button
                    type="button"
                    className="fm-icon-button"
                    aria-label="More conversation options"
                    onClick={() =>
                      setNotice(
                        `Booking status: ${
                          activeConversation.status || "Unavailable"
                        }.`
                      )
                    }
                  >
                    <MoreHorizontal size={19} />
                  </button>
                </header>

                <div className="fm-chat-messages" aria-live="polite">
                  <div className="fm-date-divider">
                    <span>Conversation history</span>
                  </div>

                  {loadingMessages ? (
                    <div className="fm-list-empty">
                      <span>Loading messages...</span>
                    </div>
                  ) : activeConversation.messages.length === 0 ? (
                    <div className="fm-no-chat">
                      <h2>No messages yet</h2>
                      <p>
                        Send a message to start the conversation about this
                        booking.
                      </p>
                    </div>
                  ) : (
                    activeConversation.messages.map((message) => {
                      const sender = getMessageSender(message);

                      return (
                        <div
                          key={message._id || message.id}
                          className={`fm-message-row ${
                            sender === "me" ? "is-mine" : "is-theirs"
                          }`}
                        >
                          <article className="fm-message">
                            <p>{message.text}</p>

                            <span className="fm-message-meta">
                              {formatMessageTime(message.createdAt)}
                              {sender === "me" && (
                                <CheckCheck size={13} />
                              )}
                            </span>
                          </article>
                        </div>
                      );
                    })
                  )}
                </div>

                <form className="fm-composer" onSubmit={sendMessage}>
                  <button
                    type="button"
                    className="fm-attachment-button"
                    aria-label="Attach a file"
                    onClick={() =>
                      setNotice(
                        "File attachments are not supported by the current API."
                      )
                    }
                  >
                    <Paperclip size={17} />
                  </button>

                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                    aria-label="Message"
                    maxLength={2000}
                    disabled={sending || loadingMessages}
                  />

                  <button
                    type="button"
                    className="fm-attachment-button fm-emoji-button"
                    aria-label="Insert emoji"
                    onClick={() =>
                      setMessageText((current) => `${current}😊`)
                    }
                    disabled={sending}
                  >
                    <Smile size={17} />
                  </button>

                  <button
                    type="submit"
                    className="fm-send-button"
                    disabled={
                      !messageText.trim() || sending || loadingMessages
                    }
                    aria-label="Send message"
                  >
                    <Send size={15} />
                  </button>
                </form>
              </>
            ) : (
              <div className="fm-no-chat">
                <h2>
                  {loadingConversations
                    ? "Loading conversations..."
                    : "Select a conversation"}
                </h2>
                <p>
                  {loadingConversations
                    ? "Please wait while your messages load."
                    : "Choose an existing booking conversation to view your messages."}
                </p>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

export default FreelancerMessages;