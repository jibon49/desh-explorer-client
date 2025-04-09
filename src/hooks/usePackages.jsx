import { useEffect, useState } from "react"


const usePackages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(ture);
    useEffect(()=>{
        fetch('http://localhost:5000/tourpackages')
        .then(res=>res.json())
        .then(data=>{
            setPackages(data);
            setLoading(false);
        });
    },[])
    return[packages,loading]
}

export default usePackages