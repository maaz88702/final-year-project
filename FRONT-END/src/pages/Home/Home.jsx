import { useEffect } from 'react';
import Nav from '../../components/Nav/Nav';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("jwt");
    useEffect(() => {
        if (!token) {
            toast.error("Please login to continue");
            navigate('/student/login')
        }
    }, [token, navigate])
    return (
        <>
            <Nav />
            Home component
        </>
    );
};

export default Home;