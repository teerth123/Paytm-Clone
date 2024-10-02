import axios from "axios";
import { useState } from "react";
import {jwtDecode}  from "jwt-decode";
import { useLocation } from "react-router-dom";

export default function SendMoney() {
    const [status, setStatus] = useState("Initiate Transaction")
    const { state } = useLocation(); // Get state from location
    const { userId, firstName, lastName } = state; // Destructure userId and names
    const [amount, setAmount] = useState(0);

    const sendMoney = async () => {
        try {
            const token = localStorage.getItem("token");
            const decoded = jwtDecode(token);
            const senderId = decoded._id;

            const res = await axios.put("http://localhost:3000/api/v1/account/transfer", 
                { senderId, to: userId, amount },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            setStatus("Payment Successful")
            console.log(res.data); // Handle the response accordingly
        } catch (error) {
            console.error("Error transferring money:", error);
        }
    };

    return (
        <div className="bg-white min-h-screen flex items-center justify-center">
            <div className="w-[350px] h-[350px] shadow-sm rounded border-2 items-center justify-center">
                <h2 className="font-bold text-3xl text-center mt-3">Send Money</h2>
                <div >
                    <h2 className="m-1 font-medium ml-3 mt-5">To</h2>
                    <div className="flex ml-5">
                        <h2 className="m-1 font-bold text-xl text-green-500">{firstName}</h2>
                        <h2 className="m-1 font-bold text-xl text-green-500">{lastName}</h2>
                    </div>
                    
                </div>
                <h4 className="m-1 font-medium ml-3 mt-5">Amount:</h4>
                <input 
                    type="text" 
                    required 
                    placeholder="Enter Amount to be sent" 
                    className="border-2 max-w-full text-center ml-[80px] mt-5 mx-7 rounded"
                    onChange={(e) => setAmount(e.target.value)} // Correctly set amount
                />
                <div 
                    className="bg-green-500 text-white h-10 text-center mx-7 rounded mt-5 cursor-pointer font-bold" 
                    onClick={sendMoney} // Call sendMoney on click
                >
                    {status}
                </div>
            </div>
        </div>
    );
}
