import React, { useState } from 'react';

export default function FreelancerMessages() {
    const [selectedChat, setSelectedChat] = useState({ name: 'John Smith', status: 'Online' });
    const [messageText, setMessageText] = useState('');

    const chats = [
        { id: 1, name: 'John Smith', lastMessage: 'I\'ve attached the brief...', time: '2m ago', active: true },
        { id: 2, name: 'Tech Corp', lastMessage: 'Please find the update.', time: '1hr ago', active: false },
        { id: 3, name: 'Emma Brown', lastMessage: 'Thank you!', time: '3 hrs ago', active: false },
        { id: 4, name: 'Mike Johnson', lastMessage: 'Can you make changes?', time: '1 day ago', active: false }
    ];

    const messages = [
        { sender: 'John Smith', text: 'Hi Sarah, I\'ve attached the brief for the logo design. Can you take a look?', time: '01:02 AM' },
        { sender: 'You', text: 'Hi John! Sure, I\'ll check it and get back to you shortly.', time: '01:03 AM' }
    ];

    const handleSend = (e) => {
        e.preventDefault();
        if (!messageText.trim()) return;
        messages.push({ sender: 'You', text: messageText, time: 'Just now' });
        setMessageText('');
    };

    return (
        <div className="freelancer-dashboard">
            <div className="freelancer-dashboard-content">
                <div className="freelancer-welcome">
                    <p className="freelancer-eyebrow">Communication</p>
                    <h1>Messages</h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '16px', background: '#fff', border: '1px solid var(--fd-border)', borderRadius: '9px', minHeight: '500px' }}>
                    {/* Conversations List */}
                    <div style={{ borderRight: '1px solid var(--fd-border)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '16px', borderBottom: '1px solid var(--fd-border)' }}>
                            <input type="text" placeholder="Search messages..." style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--fd-border)', borderRadius: '6px', fontSize: '0.78rem' }} />
                        </div>
                        <div style={{ overflowY: 'auto', flex: 1 }}>
                            {chats.map(chat => (
                                <div key={chat.id} onClick={() => setSelectedChat(chat)} style={{ padding: '14px 16px', borderBottom: '1px solid #f0f1f5', background: chat.active ? '#f8f9fc' : '#fff', cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <strong style={{ fontSize: '0.82rem', color: '#202433' }}>{chat.name}</strong>
                                        <span style={{ fontSize: '0.68rem', color: '#778092' }}>{chat.time}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#778092', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.lastMessage}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Chat Window */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ padding: '16px', borderBottom: '1px solid var(--fd-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 750 }}>{selectedChat.name}</h2>
                                <span style={{ fontSize: '0.68rem', color: '#5d9b71' }}>{selectedChat.status}</span>
                            </div>
                        </div>

                        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {messages.map((m, idx) => (
                                <div key={idx} style={{ alignSelf: m.sender === 'You' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                                    <div style={{ background: m.sender === 'You' ? '#eceaff' : '#f2f3f6', padding: '12px 14px', borderRadius: '8px', fontSize: '0.78rem', color: '#202433' }}>
                                        {m.text}
                                    </div>
                                    <span style={{ fontSize: '0.62rem', color: '#778092', marginTop: '4px', display: 'block', textAlign: m.sender === 'You' ? 'right' : 'left' }}>{m.time}</span>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSend} style={{ padding: '16px', borderTop: '1px solid var(--fd-border)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input 
                                type="text" 
                                placeholder="Type a message..." 
                                value={messageText} 
                                onChange={(e) => setMessageText(e.target.value)} 
                                style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--fd-border)', borderRadius: '6px', fontSize: '0.78rem' }}
                            />
                            <button type="submit" style={{ background: 'var(--fd-violet)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '650', cursor: 'pointer' }}>Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}