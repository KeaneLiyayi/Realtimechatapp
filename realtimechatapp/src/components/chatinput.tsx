"use client";
import React, { useEffect, useState } from 'react';

interface ChatProps {
    users: SocketUser[] | undefined;
    socket: any;
    selectedUser: SocketUser;
}

interface Content {
    message: string;
    fromSelf: boolean;
}

const ChatInput: React.FC<ChatProps> = ({ users, socket, selectedUser }) => {
    const [chatMessage, setChatMessage] = useState<string>("");

    const getMessagesForSelectedUser = () => {
        const user = users?.find(u => u.userId === selectedUser.userId);
        return user?.messages || [];
    };

    const [messages, setMessages] = useState<Content[]>(getMessagesForSelectedUser());

    useEffect(() => {
        socket.on('privateMessage', ({ message, from }) => {
            console.log(message)
            users?.forEach(user => {
                if (user.userId === from) {
                    if (!user.messages) {
                        user.messages = [];
                    }
                    user.messages.push({
                        message,
                        fromSelf: false,
                    });

                    // Update messages for the selected user
                    if (user.userId === selectedUser.userId) {
                        setMessages([...user.messages]); // Create a new array reference
                    }
                }
            });
        });

        return () => {
            socket.off('privateMessage');
        };
    }, [socket, users, selectedUser]);

    useEffect(() => {
        if (users) {
            users.forEach(user => {
                if (user.userId === selectedUser.userId) {
                    setMessages(user.messages);
                }
            });
        }
    }, [selectedUser])

    const handleClick = () => {
        if (chatMessage) {
            socket.emit('privateMessage', {
                message: chatMessage,
                to: selectedUser,
            });

            if (!selectedUser.messages) {
                selectedUser.messages = [];
            }
            selectedUser.messages.push({
                message: chatMessage,
                fromSelf: true,
            });

            // Update messages state immediately
            setMessages([...selectedUser.messages]);

            setChatMessage("");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChatMessage(e.target.value);
    };

    return (
        <div className='min-h-screen flex flex-col border border-[2px] border-white justify-between'>
            <div>
                <h2>Clement</h2>
            </div>
            <div>
                <ul>
                    {messages?.map((msg, index) => (
                        <li key={index}>
                            <p className={`text-xs ${msg.fromSelf ? 'text-right' : 'text-left'}`}>{msg.message}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <div className='flex'>
                    <input type="text" value={chatMessage} onChange={handleChange} />
                    <button onClick={handleClick}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
