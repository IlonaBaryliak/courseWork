import { Container, Row, Col } from 'react-bootstrap';
import "../styles/Home.css";
import Road from "../assets/long-road1.svg"
import Bus from "../assets/white-bus.svg"
import ArrowIcon from '../assets/arrow-up-right.svg';
import PlusIcon from '../assets/Plus.svg';
import { Link } from 'react-router-dom';
function Home() {
    return (
        <Container fluid>
            <div className="card-title">
                <h1>Додавайте автобуси, відправляйте їх <br/>на маршрут і повертайте назад <br/>у парк — все в одному місці.</h1>
            </div>

            <div className="main-content-row">
                <div className="button-group">
                    <Link to="/add" className="btn-main btn-yellow">
                        Додати автобус
                        <span className="icon-plus">
                            <img src={PlusIcon} alt="+"  />
                        </span>
                    </Link>
                    <Link to="/departure" className="btn-main btn-white">
                        Виїзд на маршрут <span className="icon-arrow">
                        <img src={ArrowIcon} alt="↗"   />
                    </span>
                    </Link>
                </div>
            </div>
            <div>
                <img src={Bus} style={{ position: 'fixed', bottom: 0, margin: '0 0 6%',  width: '30%', zIndex: 1 }} alt="Road" />
                <img src={Road} style={{ position: 'fixed', bottom: 0, width: '120%' }} alt="Road" />
                <Link to="/buses" className="btn-main-y btn-white-yellow" style={{ position: 'fixed', bottom: 0,right: 0,  margin: '0 5% 4%',  width: '30%', zIndex: 1 }} alt="Road">
                    Переглянути список автобусів <span className="icon-arrow">

                    </span>
                </Link>
            </div>

        </Container>
    );
}

export default Home;