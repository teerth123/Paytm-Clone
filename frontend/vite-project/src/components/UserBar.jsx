import { useNavigate } from "react-router-dom"
export default function UserBar({firstName, lastName, userId, onClick}){
    
    return(
        <>
            <div className="rounded w-full  px-3 py-2 flex justify-between">
                <div className="flex justify-normal">
                    <h4 className="m-1">{firstName}</h4>
                    <h4 className="m-1">{lastName}</h4>
                </div>
                <div className="bg-black text-white" onClick={()=>onClick({_id:userId, firstName, lastName})}>Send Money</div>
            </div>
        </>
    )
}