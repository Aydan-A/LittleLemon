import './Button.css';

function Button({ text, color = 'primary', onClick, type = 'button' }) {
  return (
    <button type={type} className={`btn ${color}`} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
