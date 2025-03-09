import { Link } from 'react-router-dom'

function Logo({colorText}) {
  return (
    <div className='d-flex align-items-center text-center'>
          <Link style={{textDecoration:"none"}} to="/">
          <h1 className="logo" style={{color:`${colorText}`}}>
            <span className="logo-part-1" style={{color:`${colorText}`}}>Cour</span>
            <span className="logo-part-2">ses</span>
            <b style={{fontSize:"11px"}}>.com</b>
          </h1>
        </Link>
    </div>
  )
}

export default Logo