import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair, faClock, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

const links = [
    { to: '/cadeiras', text: 'Sobre Nós', icon: faChair },
    { to: '/agendamentos', text: 'Modelos', icon: faClock },
];

function Rodape() {
    const navigate = useNavigate()

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className='rodape flex-row justify-space-ard align-center'>
            {links.map((link, index) => (
                <Link
                    key={index}
                    to={link.to}
                    className='icon-rodape'
                >
                    <div>
                        <FontAwesomeIcon icon={link.icon} size='2x' />
                    </div>
                </Link>
            ))}
            <div
                onClick={() => handleLogout()}
            >
                <FontAwesomeIcon icon={faSignOut} size='2x' />
            </div>
        </div>
    )
}

export default Rodape;