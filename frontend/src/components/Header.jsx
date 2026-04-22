import { Link } from "react-router-dom";
import "../styles/Header.css";
import bus from '../assets/Bus.svg';
 function Header(){
    return(
        <header>
            <div className="top-header">
                <Link to="/">Головна</Link>
                <Link to="/all-buses">Усі автобуси</Link>
                <img src={bus} alt="BUS" style={{ width: '6vh', height: 'auto' }}/>
                <Link to="/on-route">На маршруті</Link>
                <Link to="/parked">У парку</Link>
            </div>
        </header>
    )
}
export default Header;