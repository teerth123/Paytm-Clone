import axios from "axios";
import { useState, useEffect } from "react"
import UserBar from "./UserBar";
import { useNavigate } from "react-router-dom";

export default function Dashboard(){
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [balance, setBal] = useState(0);
    const nav = useNavigate();

    const handleUserClick = (user) => {
        nav('/send', { state: { userId: user._id, firstName: user.firstName, lastName: user.lastName } });
    };

    const fetchBalance = async () => {
        try {
            const token = localStorage.getItem("token"); // Get the token from local storage
            const res = await axios.get("http://localhost:3000/api/v1/account/balance", {
                headers: {
                    Authorization: `Bearer ${token}`, // Set the token in the headers
                },
            });
            console.log(res.data); // Log the full response to check structure
            if (res.data.balance) setBal(res.data.balance);
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };
    
    const fetchUsers = async (filter) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${filter}`);
            setUsers(response.data.user); // Update users state with response data
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(()=>{
        fetchBalance();
        fetchUsers("");
    }, []);

    // Effect to fetch users whenever the search input changes
    useEffect(() => {
        fetchUsers("");
        if (search) {
            fetchUsers(search);
        } else {
            setUsers([]); // Clear users if search is empty
        }
    }, [search]);
    return (
        <>
            <div className="flex justify-between">
                <h2 className="font-bold text-xl m-5" >Payment App</h2>
                <div className="flex m-5">
                    <h2>Hello User</h2> 
                    <div className="rounded-50% bg-black "></div>    
                </div>
            </div>
            <hr className="bg-grey"/>
            <h2 className="font-bold text-xl m-5">Your Balance : ${balance}</h2>
            <hr />
            <h3 className="font-bold text-xl m-5">Users</h3>
            <div className="flex justify-center mt-5 px-4"> {/* Add horizontal padding */}
                <input
                    type="text"
                    placeholder="Search by first name or last name"
                    className="rounded border-2 w-full  px-3 py-2"
                    onChange={(e)=>{setSearch(e.target.value)}}
                />
            </div>        
            <div>
                {
                    users.map((user)=>{
                        return <UserBar 
                        firstName={user.firstName} 
                        lastName={user.lastName} 
                        userId={user._id} 
                        key={user._id} 
                        onClick={handleUserClick} // Pass click handler
                    />
                    })
                }
            </div>
            </>
    )
}