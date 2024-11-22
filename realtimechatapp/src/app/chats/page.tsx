"use client"; // Ensure it's a client component
import socket from '@/lib/socket';
import React, { useEffect, useState } from 'react';

const Page = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState<string>();

    const handleUserChange = (user: { userId: string; username: string; self: boolean; }) => {
        setSelectedUser(user.userId);
    };

    useEffect(() => {

        socket.on("users", (users) => {
            console.log(users);
            users.forEach((user: { userId: string; username: string; self: boolean; }) => {
                user.self = user.userId === socket.id;
            });
            const sortedUsers = users.sort((a: any, b: any) => {
                if (a.self) return -1;
                if (b.self) return 1;
                if (a.username < b.username) return -1;
                return a.username > b.username ? 1 : 0;
            });
            setUsers(sortedUsers);
        });


    }, []);

    useEffect(() => {
        console.log(selectedUser); // Log when selectedUser changes
    }, [selectedUser]);

    return (
        <div>
            <div className="max-w-sm mx-auto mt-40">
                {users.map((user: { userId: string; username: string; self: boolean; }) => (
                    <div onClick={() => handleUserChange(user)} key={user?.userId} className="p-3 flex items-center justify-between border-t cursor-pointer hover:bg-gray-200">
                        <div className="flex items-center">
                            <img className="rounded-full h-10 w-10" src="https://loremflickr.com/g/600/600/girl" alt={user?.username} />
                            <div className="ml-2 flex flex-col">
                                <div className="leading-snug text-sm text-gray-900 font-bold">{user.username}</div>
                                <div className="leading-snug text-xs text-gray-600">@{user.username.toLowerCase()}</div>
                            </div>
                        </div>
                        <button className="h-8 px-3 text-md font-bold text-blue-400 border border-blue-400 rounded-full hover:bg-blue-100">Follow</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Page;
