import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair, faClock, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const links = [
    { to: '/cadeiras', text: 'Sobre Nós', icon: faChair },
    { to: '/agendamentos', text: 'Modelos', icon: faClock },
    { to: '#', text: 'Analytics', icon: faUser },
  ];

function Rodape() {
    return (
        <div className='rodape flex-row justify-space-ard align-center'>
            {links.map((link, index) => (
                <Link
                    key={index}
                    to={link.to}
                    className='icon-rodape'
                >
                    <div className=''>
                        <FontAwesomeIcon className='' icon={link.icon} size='2x' />
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default Rodape;