
function HeaderPages({title}) {
  return (

    <div>  <div
    className="header-section"
    style={{
      width: '100%',
      height: '165px',
      // background: 'linear-gradient(to right, rgba(14, 42, 70, 0.14), rgba(252, 99, 65, 0.18))',
      background: 'rgb(14, 42, 70)',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* صورة الخلفية الكبيرة (محاكاة pattern0_6_2064) */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url('https://source.unsplash.com/1920x365/?abstract')`, // بديل للصورة الكبيرة
        backgroundSize: 'cover',
        opacity: 0.5,
      }}
    />

    {/* صورة صغيرة 1 (محاكاة pattern1_6_2064) */}
    <img
      src="data:image/png;base64,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"
      style={{
        position: 'absolute',
        left: '38.39px',
        top: '102.19px',
        width: '77px',
        height: '85px',
      }}
      alt="Pattern 1"
    />

    {/* صورة صغيرة 2 (محاكاة pattern2_6_2064) */}
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFUAAAAYCAYAAACLM7HoAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAVdSURBVHgB7VlbVmJHFD2nMMt82p/9SBpH0DgC8b8j9AiUEXgdgTgCryMQRiB0euVXMgJxBK2JSP7CZ6Pcqux6wAW5j7po0itrWWu5lAvsU2dX1Tm7thzU7hQR9UnK0/DXdy0qMIL61w2SPx4Q0z6RKuPRiIiBFbULY338s0qltSPgVPByw2KpDvH9cdjZvC6E9cvtPonS3hxWnxR3SHxrF8FKyA+De3n5ibD7homjQ2KuBrXBJYDK5BXwtkJq/ZKExPe/7Vic8Saw2iTEUbA7PCLPcVj/64BKpXNi1dUYFou38PoKMS4OPw33fLGC2vCMBIOIyXGMJRtEclNj+ec3LJv8WJaB1dA4Fgu4Or/a3bkhPWHwItCgiRXdw2S2sKKj9ICaUAESokbY+am3/D6CIQG9O8LPr48pe/JHpNQ+Yu4k7SKbnLpgwc2T89ftTCxNqJIcfn67nxzrNsC8D9JiPY6Jnzawmomf2R20sPDvQfTO4/d4GVATSzUcu50kYmNCJY5l+hHwITaPUFpM8hLEBmnE5hE6N/9MYn0InX3WEEsq7L5tzD/n5MBux0oQ52pHXF80CdmExjiOWFJ9elCn4W/v+u55meS6rlX1PEJjLLeYilvztXFWi5W8ySM0KT8qPXT05jFzjX6o66PtQ+gMa/c2JBY1inBqv9hTyxlJ7CMJXcuq7tHqjcNiHeDPint0jcXBjrsPs8rMMg52kZRNHLttvCy7xz0scttnkZewlDohm59rjGhoHB0nlbRsrLn8omiHXsbL+F8MRrFt4kj1pvWg6JjVImYcJx6RivpPwCoDq2qx1DXqXa9oqZlh6VrLpQrKDHpB1Ke1qFek1MzNaYMmpSp0b8U3P3aF9gPpGhVNDsMvP3fIc2h9qZQMUGt7UAw3+L1hirauTzz+5EuIa2hnZOob6rbGYtZzQiIE0T4+9iXENjQGliZAXpnfUyxJuOC8CclzuPyaZC4PGgtjylVGg+V4MlhZVTrz0YPm81rCkMROuF8ib07v5nb2WMLILomH5jx5tjFFgWlMKRJvEStd7sVxuJWnnd3nU+Wea0wn2ISNpE3ISYHziLUBZT0rURf4KItYt0Mv8ySMPU28DT24lT6nGaFYZCvdEubtRayPfs6Kx6mBE46K1arrIEpVPXdOqtC2cSR0J3V9NKET2h8ST4bRqvqai53TyS5fecT6XkhcfpbYOT2vB2cG1rVR4T6uCzTTe2MsKNl+fEyzAw/q+D70oEBdiq4MltA1Ti8MFq7jX+NmZUXXcMlXpgmx2DZmR8YOTcxvqnd1zTY13ORXJ6Ohxw3/fjDliq/Bze8k7kPO/gJ2gBRV04CEuCZC5+sU7+zWeIBCkFyOscat1brxUGMAC0aHbkJC9ogm/dWwnic/i4XNI9EMhfJu9C/jZXzfwfAF/17ZWE40qUWPoofTohcAW/RL+v5cdVh9Y8Ss4jUsG95PNeGrDot8uBLWWDbG6wEIvkgzXpcDOpOaole66wLnlcPqohOfFTaplbhAs7mJDW8Yy4wGghjBxz/qvlhGP5egIZ1Jbec1NeHvvhY3qUFmjIUfeWpN+LuTtO8mmNTpXupiQKVd8cMkd8i9f/69TGp04CDZC/a7lPib1Mteqh7LOtUJ7XST2gX0M6kvs4S2/jeJkqqZn6SHsHc3vKwLgsXKJvbfM6kTjNfVTOqphoOuXDSp3SXiGU1qHDHnN4zysVJM+MlaRZeuYib1oGU2YQGT2hnLELZayxkT1xx5L5G9lIRtGnawOn2CSV2bezwqeomwWGaRnElt8iuTMbyfZFLrS4ifSe1b3D1wNnwb4X+MVaZnGNM5/QP1x3CleMrJSwAAAABJRU5ErkJggg=="
      style={{
        position: 'absolute',
        left: '422.39px',
        top: '80.47px',
        width: '85px',
        height: '24px',
      }}
      alt="Pattern 2"
    />

  

    {/* صورة صغيرة 4 (محاكاة pattern4_6_2064) */}
    <img
      src="data:image/png;base64,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"
      style={{
        position: 'absolute',
        right: '123.59px', // 1920 - 1796.41
        top: '54.75px',
        width: '66px',
        height: '65px',
      }}
      alt="Pattern 4"
    />

    {/* نص "BLOG STYLE 1" في المنتصف */}
    <div
      className="text-center"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        fontSize: '48px',
        fontWeight: 'bold',
      }}
    >
      {title}
    </div>

  
  </div>
</div>
  )
}

export default HeaderPages