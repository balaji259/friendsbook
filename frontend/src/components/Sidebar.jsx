import {useEffect,useState, useContext} from "react";
import {useChatStore} from "./useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import {useSocket} from "./useSocket";
import { AuthContext } from "./AuthContext";





import { useNavigate, useLocation, useSearchParams } from "react-router-dom";


const Sidebar=() => {
    // const {getUsers,clearUsers, users,selectedUser,setSelectedUser,isUsersLoading}=useChatStore();
    const { getUsers,clearUsers,users, selectedUser, setSelectedUser, chatUserId, setChatUserId, isUsersLoading } = useChatStore();
    const {onlineUsers} =useSocket();

    // const onlineUsers=[];
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);


    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
        const { token, authuser } = useContext(AuthContext);

    useEffect(()=>{
        
        clearUsers();
        getUsers();
        
    },[getUsers,clearUsers]); 

   
    useEffect(() => {
        // const chatUserId = searchParams.get("chatUserId");
        if (chatUserId && users.length > 0) {
          const userToSelect = users.find((user) => user._id === chatUserId);
          if (userToSelect) setSelectedUser(userToSelect);
        }
      }, [chatUserId, users, setSelectedUser]);
    

      const handleUserSelect = (user) => {
        setSelectedUser(user);
        setChatUserId(user._id);
        // const newUrl = new URLSearchParams(location.search);
        // newUrl.set("chatUserId", user._id); // Add `chatUserId` to URL
        // navigate(`${location.pathname}?${newUrl.toString()}`); // Preserve current path
      };

   
    const filteredUsers = users
    .filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((user) => (showOnlineOnly ? onlineUsers.includes(user._id) : true));

    const onlineUsersCount = onlineUsers?.length ? onlineUsers.length - 1 : 0;


    if(isUsersLoading) return <SidebarSkeleton />

    return (
        <aside className="h-full w-20 lg:w-72 border-base-300 flex flex-col transition-all duration-200 border-r-2">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>

                </div>

               {/* Search Bar */}
        <div className="mt-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter a user name..."
            className="w-full px-3 py-2 border border-zinc-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>


                {/*todo :online filter toggle */}

                <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsersCount} online)</span>
        </div>
                
             </div>

             <div className="overflow-y-auto w-full py-3">
                {filteredUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={()=>handleUserSelect(user)}
                        className={
                            `w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${selectedUser?._id===user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`
                        }
                    >
                    <div className="relative mx-auto lg:mx-0">
                        <img 
                            // src={user.profilePic || "/avatar.png"}
                            src={user.profilePic === '/images/squarepfp.png' ? '/images/squarepfp.png' : `${user.profilePic}`}
                            alt={user.name}
                            className="size-12 object-cover rounded-md"
                        />
                        {/* {onlineUsers.includes(user._id) && (
                            <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                                
                        )}  */}
                        {onlineUsers && Array.isArray(onlineUsers) && onlineUsers.includes(user._id) && (
    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
)}
                    </div>

                    {/*userinfo -nly visible on larger screens */}
                    <div className="hidden lg:block text-left min-w-0" >
                        <div className="font-medium truncate text-red">{user.username || user.fullname}</div>
                        <div className="text-sm text-zinc-400">
                            { onlineUsers && Array.isArray(onlineUsers) && onlineUsers.includes(user._id) ? "Online" :"Offline"}

                        </div>
                        
                    </div>
                    
                    </button>
                ))}

{filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users</div>
        )}


             </div>

        </aside>
    );
};

export default Sidebar;