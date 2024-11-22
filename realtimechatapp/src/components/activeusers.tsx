import React from 'react'

interface ActiveUsersProps {
    users: SocketUser[] | undefined;
    setSelectedUser: (user: SocketUser) => void;
}

const ActiveUsers: React.FC<ActiveUsersProps> = ({ users, setSelectedUser }) => {



    const handleUserChange = (user: SocketUser) => {
        setSelectedUser(user)
        console.log(user)
    }

    return (
        <div>
            <div className="max-w-sm mx-auto mt-40">
                {users?.map((user: SocketUser) => (
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
    )
}

export default ActiveUsers

