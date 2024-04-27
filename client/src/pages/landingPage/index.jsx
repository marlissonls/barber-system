import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { validateName, validateTelefone, validateEmail, validatePassword } from '../../services/validateFields';
import { set_token, set_id, set_username, set_telefone, set_email, set_tipo, } from '../../services/auth';
import api from '../../services/api';
import logo from '../../assets/logo.png';

function LandingPage(props) {

  const { enqueueSnackbar } = useSnackbar();

  function messageError(message) {
    enqueueSnackbar(message, { variant: "error", style: {fontFamily: 'Arial'} });
  }

  function messageSuccess(message) {
    enqueueSnackbar(message, { variant: "success", style: {fontFamily: 'Arial'} });
  }

  /////////////////////////////
  // HANDLE MODAL CHANGING

  const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);
  const [isRegisterFormVisible, setIsRegisterFormVisible] = useState(false);

  const handleLoginForm = () => {
    if (isLoginFormVisible) {
      setIsLoginFormVisible(false)
    } else {
      setIsLoginFormVisible(true)
    }
  }

  const handleResgiterForm = () => {
    if (isRegisterFormVisible) {
      setIsRegisterFormVisible (false)
    } else {
      setIsRegisterFormVisible (true)
    }
  }

  /////////////////////////////
  // SHOW LOGIN FORM

  const [identificador, setIdenficador] = useState(''); // identificador = email ou telefone
  const [password, setPassword] = useState('');

  function getLoginInputErrors() {
    const errors = []
    // errors[0] = validateEmail(identificador)
    // errors[1] = validatePassword(password)
    errors[0] = validatePassword(password)
    return errors
  }

  const loginErrors = getLoginInputErrors()
  const hasLoginErrors = loginErrors.some((item) => item !== "")

  const navigate = useNavigate();

  async function handleLoginSubmit(e) {
    e.preventDefault();

    const response = await api.post(`/login`, {
      identificador: identificador, senha: password
    })

    if (response.data.status) {
      messageSuccess(response.data.message)
      set_token(response.data.usuario.token)
      set_id(response.data.usuario.id)
      set_username(response.data.usuario.nome)
      set_telefone(response.data.usuario.telefone)
      set_email(response.data.usuario.email)
      set_tipo(response.data.usuario.tipo)
      if (response.data.usuario.tipo === 'cliente') {
        navigate('/cadeiras')
      } else {
        console.log(response.data.usuario.tipo, 'login teste')
        navigate('/barbeiro')
      }
    } else {
      messageError(response.data.message)
    }
  }


  /////////////////////////////
  // SHOW REGISTER USER FORM

  const [username, setUsername] = useState('');
  const [registerTelefone, setRegisterTelefone] = useState('')
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  function getRegisterInputErrors() {
    const errors = [];
    errors[0] = validateName(username);
    errors[1] = validateEmail(registerEmail);
    errors[2] = validateTelefone(registerTelefone);
    errors[3] = validatePassword(registerPassword);
    return errors;
  }
  
  const registerErrors = getRegisterInputErrors();
  const hasRegisterErrors = registerErrors.some((item) => item !== '');

  async function handleRegisterSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nome', username);
    formData.append('telefone', registerTelefone);
    formData.append('email', registerEmail);
    formData.append('senha', registerPassword);
 
    const response = await api.post(`/register`, {
      nome: username,
      telefone: registerTelefone,
      email: registerEmail,
      senha: registerPassword
    })

    if (response.data.status) {
      messageSuccess(response.data.message);
      handleResgiterForm()
      handleLoginForm();
    } else {
      messageError(response.data.message);
    }
  }

  /////////////////////////////

  return <div className='body'>
    <div className='logo-box vha-center'>
      <img className='logo' src={logo} alt='Logo' />
    </div>
    <div className='profile-container-topbar'>
      {isLoginFormVisible && <form className='form flex-column align-center gap-20' onSubmit={handleLoginSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Digite seu e-mail ou nº telefone"
          value={identificador || ""}
          onChange={(e) => setIdenficador(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="******"
          value={password || ""}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className='button submit-button'
          type="submit" 
          disabled={hasLoginErrors || identificador === '' || password === ''}>
          LOGIN
        </button>

        <div className='message-box'>
          {(loginErrors[0] && <div className="empty-fields">{loginErrors[0]}</div>) || 
          (loginErrors[1] && <div className="empty-fields">{loginErrors[1]}</div>) ||
          ((identificador === '' || password === '') && <div className="empty-fields">Há campos vazios</div>)}
        </div>
        

        <span className='login-cadastro-toggle'>
          Ainda não possui conta? <span  onClick={() => {handleLoginForm(); handleResgiterForm()}}>Cadastre-se</span>
        </span>
      </form>}

      {isRegisterFormVisible && <form className='form flex-column align-center gap-20' onSubmit={handleRegisterSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Nome"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="input"
          type="text"
          placeholder="Telefone"
          value={registerTelefone || ""}
          onChange={(e) => setRegisterTelefone(e.target.value)}
        />
        
        <input
          className="input"
          type="text"
          placeholder="E-mail"
          value={registerEmail || ""}
          onChange={(e) => setRegisterEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="******"
          value={registerPassword || ""}
          onChange={(e) => setRegisterPassword(e.target.value)}
        />

        <button 
          className='button submit-button' 
          type='submit'
          disabled={hasRegisterErrors || username === '' || registerEmail === '' || registerPassword === ''}
        >
          CADASTRAR
        </button>

        <div className='message-box'>
          {(registerErrors[0] && <div className="empty-fields">{registerErrors[0]}</div>) || 
          (registerErrors[1] && <div className="empty-fields">{registerErrors[1]}</div>) ||
          (registerErrors[2] && <div className="empty-fields">{registerErrors[2]}</div>) ||
          ((username === '' || registerTelefone === '' || registerEmail === '' || registerPassword === '') && <div className="empty-fields">Há campos vazios</div>)}
        </div>
        

        <span className='login-cadastro-toggle'>
          Já possui uma conta? <span onClick={() => {handleLoginForm(); handleResgiterForm()}}>Faça Login</span>
        </span>
      </form>}
    </div>
  </div>
}

export default LandingPage;