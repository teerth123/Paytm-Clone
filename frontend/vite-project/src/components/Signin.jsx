import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Signin(){
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(""); 
    const nav = useNavigate();
    function call(){
        axios.post("http://localhost:3000/api/v1/user/sign-in", {firstName, lastName, password})
        .then(function(res){
            if(res.data.token){
                setToken(res.data.token);
                //add token in headers
                localStorage.setItem("token", res.data.token);
                nav("/dashboard");
            }else{
                console.log("wrong credentials");
            } 

        })
    }
    return (
        <>
            <div className="bg-[#7F7F7F] min-h-screen flex items-center justify-center">
            <div className="bg-[#FFFFFF] max-w-[350px] w-full p-6 rounded flex flex-col">
                <h3 className="text-center font-bold text-3xl">Sign-in</h3>
                <h5 className="text-center mt-2">Enter your credentials to access your account</h5>
                
                <label className="font-bold text-l mt-5">First Name</label>
                <input type="text" placeholder="John" required className="mt-2 pl-3 border border-gray-300 w-full rounded" onChange={(e)=>setfirstName(e.target.value)}/>

                <label className="font-bold text-l mt-5">Last Name</label>
                <input type="text" placeholder="Doe" required className="mt-2 pl-3 border border-gray-300 w-full rounded" onChange={(e)=>setlastName(e.target.value)} />

                <label className="font-bold text-l mt-5">Password</label>
                <input type="password" required className="mt-2 pl-3 border border-gray-300 w-full rounded" onChange={(e)=>setPassword(e.target.value)}/>

                <button className="bg-black w-full h-10 text-white rounded mt-5" onClick={call}>Sign-in</button>

                <div className="flex justify-center mt-5">
                    <span className="font-medium">Don't have an account? </span>
                    <span className="ml-2 underline font-medium cursor-pointer" onClick={()=>{nav("/signup")}}>Sign-up</span>
                </div>
            </div>
        </div>
        </>
    )
}