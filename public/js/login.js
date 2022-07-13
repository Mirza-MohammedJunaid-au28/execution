const loginBtn = document.getElementById('login');
const error = document.getElementsByClassName('login-error')[0];

loginBtn.addEventListener('click', async () =>{
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const data = {
        email,
        password
    }
    fetch('/login',{method:'POST', body:JSON.stringify(data), headers: {
    'Content-Type': 'application/json'
    }})
    .then(data=> {
        if(data.status == 200) {
            return data.json();
        } else  {
            throw new Error(data.statusText);
        }
    }).then(resp => {
        localStorage.setItem('token', resp.token);
         window.location.href = '/dashboard';
    }).catch(err => {
        error.innerHTML = err;
    })
})