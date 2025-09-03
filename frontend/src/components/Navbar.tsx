import style from './Navbar.module.scss';
import logo from './../logo.svg';

export default function Navbar(){
    return(
        <nav className={style.navbar}>
            <div className={style.logo}>
                <img src={logo} alt="Logo"/>
                <p>Notifica</p>
            </div>
        </nav>
    );
}