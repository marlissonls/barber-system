import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

const links = [
    { to: '/gerente', icon: faChair },
];

function RodapeGerente() {
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

export default RodapeGerente;