"use client"
import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { getSession } from 'next-auth/react';
import Link from "next/link";
import ActiveUsers from "@/components/activeusers";
import ChatInput from "@/components/chatinput";


const Page = () => {

    const [selectedUser, setSelectedUser] = useState<SocketUser>({
        userId: '',
        username: '',
        messages: [],
    });
    const [user, setUser] = useState()
    const [socketUsers, setUsers] = useState<SocketUser[] | undefined>()

    useEffect(() => {
        const getSessionData = async () => {
            const sessionData = await getSession()
            const email = sessionData?.user?.email
            console.log(email)
            socket.auth = { email }
            socket.connect();









        }

        getSessionData();





        socket.on('connect', () => {
            console.log('Connected to the server');

        });

        socket.on('connect_error', (err) => {
            console.error('Connection Error:', err);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from the server');
        });
        socket.on('session', ({ sessionId, userId, email }) => {
            socket.auth = { sessionId }
            localStorage.setItem("sessionId", sessionId)
            socket.userId = userId;


        })
        socket.on("users", (users) => {
            setUsers(users);
            users.forEach((user: SocketUser) => {
                user.self = user.userId === socket.userId;
            });
            // put the current user first, and then sort by username
            users = users.sort((a: any, b: any) => {
                if (a.self) return -1;
                if (b.self) return 1;
                if (a.username < b.username) return -1;
                return a.username > b.username ? 1 : 0;
            });
        });

        return () => {
            socket.off('connect');
            socket.off('connect_error');
            socket.off('disconnect');
        };
    }, []);





    return (
        <div className="flex">
            <ActiveUsers setSelectedUser={setSelectedUser} users={socketUsers} />
            <ChatInput socket={socket} users={socketUsers} selectedUser={selectedUser} />

        </div>
    );
};

export default Page;
