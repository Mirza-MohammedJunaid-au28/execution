const namee = document.getElementsByClassName('name')[0];
const useremail = document.getElementsByClassName('email')[0];
const pass1 = document.getElementsByClassName('password1')[0];
const pass2 = document.getElementsByClassName('password2')[0];
const submitBtn = document.getElementsByClassName('submitBtn')[0];
const error = document.getElementsByClassName('form-error')[0];

var isName = false
var isPassword = false
var isPasswordVerify = false

namee.addEventListener('change',namevalidate)
pass1.addEventListener('change',passwordvalidate)
pass2.addEventListener('change',confirmPassword)
submitBtn.addEventListener('click',checkall)

function namevalidate(){
    if(namee.value.length < 5){
        error.innerText = "Name length should be greater than 5"
        isName = false
    }
    else{
        isName = true
    }
}

function passwordvalidate(){
    let isUpper = false
    let isLower = false
    let integer = false
    let special = false
    let specialChar = ["/","\\","+","=","@","$"]
    let passwordVal = pass1.value
    
    if(passwordVal.length > 7 && passwordVal.length  < 16){
        for(let i=0;i<passwordVal.length;i++){

            if( passwordVal[i] == parseInt(passwordVal[i])){
                integer = true
                continue;
            }
            for(x in specialChar){
                if(specialChar[x] === passwordVal[i]){
                    special = true
                    continue;
                }
            }
            if(passwordVal[i] === passwordVal[i].toUpperCase()){
                isUpper = true;
                continue;
            }
            if(passwordVal[i] == passwordVal[i].toLowerCase()){
                isLower = true;
                continue;
            }
        }

        if(! isUpper == isLower == integer == special == true){
            isPassword=false
           return error.innerHTML = "Password Should Contain : Atleast 1 UpperCase , Atleast 1 LowerCase , Atleast 1 Number , Atleast 1 Special character"
        }
            error.innerHTML = ""
            isPassword = true
    }
    else{
        isPassword = false
       return error.innerHTML = "Password : Password length should between 8 - 16"
    }
}

function confirmPassword(){

    if(isPassword){
        if(pass1.value === pass2.value){
            error.innerHTML = ""
            return isPasswordVerify = true
        }
        else{
            isPasswordVerify = false
            return error.innerHTML = "Password not match"
        }
    }
}

function checkall(){
    if(isName == isPassword == isPasswordVerify == true){
        const name = namee.value;
        const email = useremail.value;
        const password = pass1.value;
        const data = {
            name,
            email,
            password
        }
        fetch('/signup',{method:'POST', body:JSON.stringify(data), headers: {
            'Content-Type': 'application/json'
            }})
            .then(data=> {
                if(data.status == 200) {
                    return data.json();
                } 
                else if(data.status == 409){
                    window.location.href = '/userExists';
                }
                else if(data.status == 500){
                    window.location.href = '/something';
                }
                else  {
                    throw new Error(data.statusText);
                }
            }).then(resp => {
                if (localStorage.getItem("token") != null) {
                        localStorage.clear();
                }
                localStorage.setItem('token', resp.token);
                 window.location.href = '/dashboard';
            }).catch(err => {
                error.innerHTML = err;
            })
    }

}
