import React, { useMemo, useState } from "react";

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
import "../styles/FreelancerMessages.css";

const initialConversations = [
  {
    id: "1",
    name: "John Smith",
    initials: "JS",
    online: true,
    unread: 1,
    time: "10:42 AM",
    preview: "Hi Sarah, I've attached the...",
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Hi Sarah, I've attached the first few logo concepts. Can you take a look?",
        time: "10:35 AM",
      },
      {
        id: 2,
        sender: "me",
        text: "Hi John! Thank you for sending these through.",
        time: "10:38 AM",
      },
      {
        id: 3,
        sender: "them",
        text: "Let me know if you would like any changes.",
        time: "10:42 AM",
      },
    ],
  },
  {
    id: "2",
    name: "Tech Corp",
    initials: "TC",
    online: true,
    unread: 0,
    time: "Yesterday",
    preview: "Please find the brief attached.",
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Hello! Please find the project brief attached.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "3",
    name: "Emma Brown",
    initials: "EB",
    online: false,
    unread: 0,
    time: "2 days ago",
    preview: "Thank you!",
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Thank you for completing the design. Everything looks great!",
        time: "2 days ago",
      },
    ],
  },
  {
    id: "4",
    name: "Mike Johnson",
    initials: "MJ",
    online: false,
    unread: 0,
    time: "3 days ago",
    preview: "Can you make changes?",
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Hi, could you make a few small changes to the design?",
        time: "3 days ago",
      },
    ],
  },
];

function FreelancerMessages() {
  const [conversations, setConversations] = useState(
    initialConversations
  );
  const [activeId, setActiveId] = useState("1");
  const [search, setSearch] = useState("");
  const [messageText, setMessageText] = useState("");
  const [notice, setNotice] = useState("");

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeId
  );

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return conversations;

    return conversations.filter(
      (conversation) =>
        conversation.name.toLowerCase().includes(query) ||
        conversation.messages.some((message) =>
          message.text.toLowerCase().includes(query)
        )
    );
  }, [conversations, search]);

  const selectConversation = (id) => {
    setActiveId(id);
    setNotice("");

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === id
          ? { ...conversation, unread: 0 }
          : conversation
      )
    );
  };

  const sendMessage = (event) => {
    event.preventDefault();

    const text = messageText.trim();

    if (!text || !activeConversation) return;

    const newMessage = {
      id: `${Date.now()}-${Math.random()}`,
      sender: "me",
      text,
      time: new Date().toLocaleTimeString("en-ZA", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeId
          ? {
              ...conversation,
              time: "Just now",
              preview: text,
              messages: [...conversation.messages, newMessage],
            }
          : conversation
      )
    );

    setMessageText("");
    setNotice(
      "Message added to the conversation locally. Connect your messaging API to deliver and save messages."
    );
  };

  const startConversation = () => {
    setNotice(
      "Connect your users API to search for clients and start a conversation."
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
                <span>
                  {conversations.length} conversations
                </span>
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
              {filteredConversations.length === 0 ? (
                <div className="fm-list-empty">
                  <Search size={20} />
                  <span>No conversations found.</span>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    className={`fm-conversation ${
                      activeId === conversation.id ? "is-active" : ""
                    }`}
                    onClick={() =>
                      selectConversation(conversation.id)
                    }
                  >
                    <span className="fm-avatar">
                      {conversation.initials}
                      {conversation.online && (
                        <span className="fm-online-dot" />
                      )}
                    </span>

                    <span className="fm-conversation-info">
                      <span className="fm-conversation-top">
                        <strong>{conversation.name}</strong>
                        <small>{conversation.time}</small>
                      </span>

                      <span className="fm-conversation-bottom">
                        <span>{conversation.preview}</span>

                        {conversation.unread > 0 && (
                          <span className="fm-unread">
                            {conversation.unread}
                          </span>
                        )}
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
                    {activeConversation.online && (
                      <span className="fm-online-dot" />
                    )}
                  </span>

                  <div className="fm-chat-contact">
                    <strong>{activeConversation.name}</strong>
                    <span>
                      {activeConversation.online ? "Online" : "Offline"}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="fm-icon-button"
                    aria-label="More conversation options"
                    onClick={() =>
                      setNotice(
                        "Conversation options can be connected to your messaging API."
                      )
                    }
                  >
                    <MoreHorizontal size={19} />
                  </button>
                </header>

                <div className="fm-chat-messages" aria-live="polite">
                  <div className="fm-date-divider">
                    <span>Today</span>
                  </div>

                  {activeConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`fm-message-row ${
                        message.sender === "me"
                          ? "is-mine"
                          : "is-theirs"
                      }`}
                    >
                      <article className="fm-message">
                        <p>{message.text}</p>

                        <span className="fm-message-meta">
                          {message.time}

                          {message.sender === "me" && (
                            <CheckCheck size={13} />
                          )}
                        </span>
                      </article>
                    </div>
                  ))}
                </div>

                <form className="fm-composer" onSubmit={sendMessage}>
                  <button
                    type="button"
                    className="fm-attachment-button"
                    aria-label="Attach a file"
                    onClick={() =>
                      setNotice(
                        "File attachments require upload support in your backend."
                      )
                    }
                  >
                    <Paperclip size={17} />
                  </button>

                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(event) =>
                      setMessageText(event.target.value)
                    }
                    aria-label="Message"
                  />

                  <button
                    type="button"
                    className="fm-attachment-button fm-emoji-button"
                    aria-label="Insert emoji"
                    onClick={() =>
                      setMessageText((current) => `${current} 😊`)
                    }
                  >
                    <Smile size={17} />
                  </button>

                  <button
                    type="submit"
                    className="fm-send-button"
                    disabled={!messageText.trim()}
                    aria-label="Send message"
                  >
                    <Send size={15} />
                  </button>
                </form>
              </>
            ) : (
              <div className="fm-no-chat">
                <h2>Select a conversation</h2>
                <p>Choose a conversation to view your messages.</p>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

export default FreelancerMessages;